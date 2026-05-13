import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBus, FaWifi, FaSnowflake, FaPlug, FaShieldAlt,
  FaSlidersH, FaTimes, FaChevronDown, FaChevronUp,
  FaTv, FaSuitcase,
} from "react-icons/fa";
import SearchBar, { formatDate } from "./SearchBar";
import SearchFilters from "./SearchFilters";
import API from "../../config/api";

// ── Duration: mins → "Xh Ym" ──
const fmtDuration = (raw) => {
  if (!raw || raw === "N/A") return "N/A";
  const mins = parseInt(String(raw).replace(/[^\d]/g, ""), 10);
  if (isNaN(mins)) return raw;
  const h = Math.floor(mins / 60), m = mins % 60;
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
};

// ── Time filter: only buses departing 1+ hour from now (today only) ──
const isValidDeparture = (departureTime, searchDate) => {
  const today = new Date().toISOString().split("T")[0];
  if (searchDate !== today) return true; // future date → show all
  if (!departureTime) return false;
  const parseMin = (t) => {
    const [timePart, period] = t.split(" ");
    let [h, m] = timePart.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };
  const depMins = parseMin(departureTime);
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  // Only treat as next-day if current time is after 10 PM AND departure is before 6 AM
  if (now.getHours() >= 22 && depMins < 360) return true;
  // Hide buses that have already departed or depart within 1 hour
  return depMins >= nowMins + 60;
};

const getMinDepartureLabel = () => {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const amenityIcon = (a) => {
  if (a === "WiFi")           return <FaWifi className="text-blue-400" />;
  if (a === "AC")             return <FaSnowflake className="text-cyan-400" />;
  if (a === "Charging Point") return <FaPlug className="text-yellow-500" />;
  if (a === "Entertainment")  return <FaTv className="text-pink-400" />;
  if (a === "Luggage")        return <FaSuitcase className="text-green-500" />;
  if (a === "Blanket")        return <FaShieldAlt className="text-purple-400" />;
  return null;
};

const normalizeBusType = (raw = "") => {
  const t = raw.toLowerCase();
  // IMPORTANT: check "non ac" / "non-ac" BEFORE checking "ac" alone
  if (t.includes("non ac") || t.includes("non-ac") || t.includes("nonac")) return "Non AC";
  if (t.includes("ac") && t.includes("sleeper")) return "AC Sleeper";
  if (t.includes("ac"))      return "AC";
  if (t.includes("sleeper")) return "Sleeper";
  if (t.includes("seater"))  return "Seater";
  return raw;
};

const getHour24 = (timeStr = "") => {
  const [hRaw] = timeStr.split(":");
  let h = parseInt(hRaw, 10);
  const isPM = timeStr.toUpperCase().includes("PM");
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return h;
};

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to,   setTo]   = useState(searchParams.get("to")   || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sync state when URL params change (e.g. new search from same page)
  useEffect(() => {
    const f = searchParams.get("from") || "";
    const t = searchParams.get("to")   || "";
    const d = searchParams.get("date") || "";
    setFrom(f); setTo(t); setDate(d);
  }, [searchParams]);

  const [allBuses,      setAllBuses]      = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [expandedCard,  setExpandedCard]  = useState(null);
  const [showFilter,    setShowFilter]    = useState(false);
  const [sortBy,        setSortBy]        = useState("");

  const [filters, setFilters] = useState({
    busTypes: [], departureTimes: [],
    priceRange: { min: 0, max: 5000 }, minRating: 0,
  });

  // Bug 1: scroll page to top on mount
  useEffect(() => { topRef.current?.scrollIntoView({ behavior: "instant" }); }, []);

  // Fetch buses whenever from/to changes
  useEffect(() => {
    if (!from || !to) { setAllBuses([]); setFilteredBuses([]); return; }
    const fetchBuses = async () => {
      try {
        setLoading(true);
        setAllBuses([]); setFilteredBuses([]);
        const res = await axios.get(
          `${API}/api/buses/search-buses`,
          { params: { origin: from.trim(), destination: to.trim() } }
        );
        // Handle both { data: [...] } and plain array responses
        const raw = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        if (raw.length === 0) {
          setAllBuses([]); setFilteredBuses([]); return;
        }
        const formatted = raw.map((bus) => ({
          id:         bus._id,
          name:       bus.busName,
          busNumber:  bus.busNumber || "",
          type:       normalizeBusType(bus.busType),
          price:      Number(bus.price) || 0,
          rating:     bus.rating || 4,
          departure:  bus.departureTime || "",
          arrival:    bus.arrivalTime   || "",
          duration:   fmtDuration(bus.travelDurationMins),
          amenities:  bus.amenities      || [],
          boarding:   bus.boardingPoints || [],
          dropping:   bus.droppingPoints || [],
          seats:      bus.seats || 40,
          totalSeats: bus.seats || 40,
          availableSeats: bus.availableSeats ?? (bus.seats || 40),
        }));

        // ── Time filter: hide buses departing within 1 hour (today only) ──
        const timeFiltered = formatted.filter(b => isValidDeparture(b.departure, date));

        const maxP = Math.max(...timeFiltered.map((b) => b.price), 0);
        setFilters((prev) => ({ ...prev, priceRange: { min: 0, max: maxP } }));
        setAllBuses(timeFiltered);
        setFilteredBuses(timeFiltered);
      } catch (err) {
        console.error("Search buses error:", err?.response?.data || err.message);
        setAllBuses([]); setFilteredBuses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [from, to]);

  // Apply filters + sort
  useEffect(() => {
    let list = [...allBuses];

    if (filters.busTypes.length > 0)
      list = list.filter((b) =>
        filters.busTypes.some((t) => {
          // Exact match: "AC" should NOT match "Non AC" or "AC Sleeper" unless explicitly selected
          if (t === "AC") return b.type === "AC";
          if (t === "Non AC") return b.type === "Non AC";
          if (t === "Seater") return b.type === "Seater" || b.type === "AC Seater";
          if (t === "Sleeper") return b.type === "Sleeper" || b.type === "AC Sleeper";
          return b.type.toLowerCase().includes(t.toLowerCase());
        })
      );

    list = list.filter((b) => b.price <= filters.priceRange.max);

    if (filters.minRating > 0)
      list = list.filter((b) => b.rating >= filters.minRating);

    if (filters.departureTimes.length > 0) {
      list = list.filter((b) => {
        const h = getHour24(b.departure);
        return filters.departureTimes.some((t) => {
          if (t === "Before 10 AM")  return h < 10;
          if (t === "10 AM–5 PM")    return h >= 10 && h < 17;
          if (t === "5 PM–11 PM")    return h >= 17 && h < 23;
          if (t === "After 11 PM")   return h >= 23;
          return false;
        });
      });
    }

    if (sortBy === "price_low")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_high") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating")     list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "departure")  list.sort((a, b) => getHour24(a.departure) - getHour24(b.departure));

    setFilteredBuses(list);
  }, [allBuses, filters, sortBy]);

  const maxPrice = allBuses.length > 0 ? Math.max(...allBuses.map((b) => b.price)) : 5000;

  const handleClearAllFilters = () => {
    setFilters({ busTypes: [], departureTimes: [], priceRange: { min: 0, max: maxPrice }, minRating: 0 });
    setSortBy("");
  };

  const handleSearch = () => {
    if (!from || !to) { alert("Please enter both cities"); return; }
    // Use setSearchParams so the URL updates and the sync useEffect fires
    navigate(`/s-to-d?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}&date=${date}`);
  };

  // Bug 4: refresh clears all fields and results
  const handleRefresh = () => {
    setFrom(""); setTo(""); setDate("");
    setAllBuses([]); setFilteredBuses([]);
    setSortBy("");
    setFilters({ busTypes: [], departureTimes: [], priceRange: { min: 0, max: 5000 }, minRating: 0 });
  };

  return (
    <div ref={topRef} className="bg-[#f5f5f5] min-h-screen font-sans">

      {/* Bug 1: SearchBar at very top */}
      <SearchBar
        from={from} setFrom={setFrom}
        to={to}     setTo={setTo}
        date={date} setDate={setDate}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
      />

      {/* Mobile filter drawer */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="relative z-50 w-72 bg-white h-full overflow-y-auto shadow-2xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">Filters</h3>
              <button onClick={() => setShowFilter(false)} className="text-gray-400 hover:text-red-500">
                <FaTimes className="text-xl" />
              </button>
            </div>
            <SearchFilters
              filters={filters} setFilters={setFilters}
              onClearAll={handleClearAllFilters}
              availableBusesCount={filteredBuses.length}
              maxPrice={maxPrice}
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-6 px-4 pb-10 flex gap-6">
        {/* Desktop filter sidebar */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-4">
            <SearchFilters
              filters={filters} setFilters={setFilters}
              onClearAll={handleClearAllFilters}
              availableBusesCount={filteredBuses.length}
              maxPrice={maxPrice}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Sort bar — Bug 8: hide sort when no results */}
          <div className="bg-white px-4 py-3 rounded-xl shadow-sm flex flex-wrap justify-between items-center gap-2 mb-4">
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold text-[#d84e55] border border-[#d84e55] px-3 py-1.5 rounded-lg"
            >
              <FaSlidersH /> Filters ({filteredBuses.length})
            </button>

            {/* Bug 8: only show sort dropdown when there are results */}
            {filteredBuses.length > 0 && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#d84e55]"
              >
                <option value="">Sort by</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="departure">Departure: Earliest</option>
              </select>
            )}

            <p className="text-[#d84e55] text-sm font-semibold">
              {filteredBuses.length} buses found{from && to ? ` • ${from} → ${to}` : ""}
              {/* Bug 9: show formatted date */}
              {date ? ` • ${formatDate(date)}` : ""}
            </p>
          </div>

          {/* Time filter notice ─ today only */}
          {date === new Date().toISOString().split("T")[0] && (
            <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-sm text-blue-700">
              <span className="font-semibold">⏰ Time Filter Active:</span>
              Showing buses departing from <span className="font-bold mx-1">{getMinDepartureLabel()}</span> onwards (1 hour from now)
            </div>
          )}

          {/* Loading animation */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-full max-w-lg h-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-50 rounded-2xl" />
                <div className="absolute top-4 right-10 w-10 h-10 bg-yellow-300 rounded-full shadow-lg shadow-yellow-200" />
                <div className="absolute top-5 left-8 flex gap-1 animate-[cloudMove_4s_linear_infinite]">
                  <div className="w-8 h-4 bg-white rounded-full opacity-80" />
                  <div className="w-12 h-5 bg-white rounded-full opacity-80 -ml-3" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-700 rounded-b-2xl" />
                <div className="absolute bottom-4 left-0 right-0 flex gap-4 animate-[roadDash_0.5s_linear_infinite]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-10 h-1.5 bg-yellow-400 rounded-full shrink-0" />
                  ))}
                </div>
                <div className="absolute bottom-6 animate-[busRide_2s_ease-in-out_infinite]" style={{ left: "10%" }}>
                  <div className="w-20 h-10 bg-orange-500 rounded-lg shadow-lg shadow-orange-300 relative">
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      {[0,1,2,3].map((i) => <div key={i} className="w-3 h-3 bg-sky-200 rounded-sm opacity-90" />)}
                    </div>
                    <div className="absolute right-0 top-0 w-5 h-full bg-orange-600 rounded-r-lg flex items-center justify-center">
                      <div className="w-3 h-2 bg-yellow-300 rounded-sm" />
                    </div>
                  </div>
                  <div className="flex justify-between px-2 -mt-1">
                    {[0,1].map((i) => (
                      <div key={i} className="w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600 animate-[spin_0.4s_linear_infinite]">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-auto mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-6 text-gray-600 font-semibold text-base">
                Finding buses for <span className="text-orange-500 font-bold">{from} → {to}</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">Hang tight, we're on the road! 🚌</p>
              <style>{`
                @keyframes busRide { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-3px)} 75%{transform:translateY(-1px)} }
                @keyframes cloudMove { 0%{transform:translateX(0)} 100%{transform:translateX(500px)} }
                @keyframes roadDash { 0%{transform:translateX(0)} 100%{transform:translateX(-56px)} }
              `}</style>
            </div>
          )}

          {/* Bug 7: centered empty state with proper spacing */}
          {!loading && filteredBuses.length === 0 && allBuses.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-red-500 text-lg font-semibold">No buses match your filters</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filter criteria</p>
              <button onClick={handleClearAllFilters} className="mt-4 text-[#d84e55] hover:underline text-sm font-semibold">
                Clear all filters
              </button>
            </div>
          )}

          {!loading && allBuses.length === 0 && !!(from && to) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-red-500 text-lg font-semibold">No buses found for this route</p>
              <p className="text-gray-500 text-sm mt-2">
                No buses available for <span className="font-semibold">{from} → {to}</span>.
                Try a different route.
              </p>
            </div>
          )}

          {/* Bus cards */}
          {filteredBuses.map((bus) => (
            <div key={bus.id} className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
                {/* Left */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <FaBus className="text-orange-500" />
                    <h3 className="font-bold text-lg text-gray-800">{bus.name}</h3>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">{bus.type}</span>
                    <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">{bus.rating}★</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{bus.departure}</p>
                      <p className="text-xs text-gray-500">{from}</p>
                    </div>
                    <div className="flex flex-col items-center px-3">
                      <p className="text-xs text-gray-400 mb-1">{bus.duration}</p>
                      <span className="text-gray-400 text-sm">→</span>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-800">{bus.arrival}</p>
                      <p className="text-xs text-gray-500">{to}</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 font-semibold mt-2">
                    💺 {bus.availableSeats} seats available
                  </p>
                </div>

                {/* Right */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:min-w-[140px]">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">₹{bus.price}</p>
                    <p className="text-xs text-gray-400">per seat</p>
                  </div>
                  <div className="flex flex-col gap-2 w-auto sm:w-full">
                    <button
                      onClick={() => setExpandedCard(expandedCard === bus.id ? null : bus.id)}
                      className="flex items-center justify-center gap-2 border border-[#d84e55] text-[#d84e55] hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      More Details {expandedCard === bus.id ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                    </button>
                    <button
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        if (!token) { setShowLoginModal(true); return; }
                        navigate("/seatbook", { state: { busData: {
                          _id: bus.id, busName: bus.name, busNumber: bus.busNumber,
                          busType: bus.type, from, to, date,
                          departureTime: bus.departure, arrivalTime: bus.arrival,
                          duration: bus.duration, price: bus.price,
                          totalSeats: bus.totalSeats, seats: bus.seats,
                          boardingPoints: bus.boarding, droppingPoints: bus.dropping,
                        }}});
                      }}
                      className="bg-[#d84e55] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expandedCard === bus.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-5 py-5">
                  <div className="flex items-center gap-4 mb-6 bg-white rounded-xl px-4 sm:px-5 py-4 shadow-sm">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-800">{bus.departure}</p>
                      <p className="text-xs text-gray-500">{from}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs font-semibold text-orange-500 mb-1">⏱ {bus.duration}</p>
                      <div className="w-full flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-green-400 to-red-400" />
                        <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Total Travel Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-800">{bus.arrival}</p>
                      <p className="text-xs text-gray-500">{to}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.map((a, i) => (
                          <span key={i} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-sm">
                            {amenityIcon(a)} {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Boarding Points</h4>
                      <div className="space-y-2">
                        {bus.boarding.map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />{b}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Dropping Points</h4>
                      <div className="space-y-2">
                        {bus.dropping.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />{d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* ── Login required modal ── */}
      {showLoginModal && (
        <div style={{position:"fixed",inset:0,zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}>
          <div style={{background:"#fff",borderRadius:"1.5rem",padding:"2.5rem 2rem",maxWidth:"380px",width:"100%",boxShadow:"0 25px 60px rgba(0,0,0,0.35)",textAlign:"center",position:"relative"}}>
            <button onClick={() => setShowLoginModal(false)} style={{position:"absolute",top:"1rem",right:"1rem",background:"#f3f4f6",border:"none",borderRadius:"50%",width:"32px",height:"32px",cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <FaTimes style={{color:"#6b7280"}} />
            </button>
            <div style={{width:"72px",height:"72px",borderRadius:"50%",background:"linear-gradient(135deg,#f97316,#dc2626)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1.25rem",fontSize:"2rem",boxShadow:"0 8px 24px rgba(249,115,22,0.4)"}}>
              🎫
            </div>
            <h3 style={{fontSize:"1.3rem",fontWeight:800,color:"#111827",marginBottom:"0.5rem"}}>Login to Book</h3>
            <p style={{fontSize:"0.9rem",color:"#6b7280",marginBottom:"0.25rem"}}>You need to be logged in to book a bus ticket.</p>
            <p style={{fontSize:"0.85rem",color:"#9ca3af",marginBottom:"2rem"}}>Join thousands of happy travellers 🚀</p>
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
              <button onClick={() => { setShowLoginModal(false); navigate("/login"); }}
                style={{background:"linear-gradient(135deg,#f97316,#dc2626)",color:"#fff",border:"none",borderRadius:"0.875rem",padding:"0.85rem",fontWeight:700,fontSize:"1rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(249,115,22,0.35)"}}>
                🔑 Login Now
              </button>
              <button onClick={() => { setShowLoginModal(false); navigate("/register"); }}
                style={{background:"#fff",color:"#f97316",border:"2px solid #f97316",borderRadius:"0.875rem",padding:"0.85rem",fontWeight:700,fontSize:"1rem",cursor:"pointer"}}>
                ✨ Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default SearchResult;
