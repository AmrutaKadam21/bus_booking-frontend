import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBus,
  FaWifi,
  FaSnowflake,
  FaPlug,
  FaShieldAlt,
  FaSlidersH,
  FaTimes,
  FaMapMarkerAlt,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaTv,
  FaSuitcase,
} from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";

const cities = [
  "Mumbai", "Pune", "Nashik", "Nagpur", "Kolhapur",
  "Aurangabad", "Solapur", "Satara", "Ahmednagar",
  "Delhi", "Bangalore", "Hyderabad", "Chennai",
];

const amenityIcon = (a) => {
  if (a === "WiFi") return <FaWifi className="text-blue-400" />;
  if (a === "AC") return <FaSnowflake className="text-cyan-400" />;
  if (a === "Charging Point") return <FaPlug className="text-yellow-500" />;
  if (a === "Entertainment") return <FaTv className="text-pink-400" />;
  if (a === "Luggage") return <FaSuitcase className="text-green-500" />;
  if (a === "Blanket") return <FaShieldAlt className="text-purple-400" />;
  return null;
};

// Filter Component with real-time filtering
const FilterContent = ({ filters, setFilters, onClearAll, availableBusesCount, maxPrice }) => {
  const toggleType = (item) => {
    setFilters(prev => ({
      ...prev,
      busTypes: prev.busTypes.includes(item)
        ? prev.busTypes.filter(x => x !== item)
        : [...prev.busTypes, item]
    }));
  };

  const toggleTime = (item) => {
    setFilters(prev => ({
      ...prev,
      departureTimes: prev.departureTimes.includes(item)
        ? prev.departureTimes.filter(x => x !== item)
        : [...prev.departureTimes, item]
    }));
  };

  const handlePriceRange = (e) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, max: parseInt(e.target.value) }
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Filters ({availableBusesCount} buses)
        </h4>
        <button
          onClick={onClearAll}
          className="text-xs text-[#d84e55] hover:underline font-semibold"
        >
          Clear All
        </button>
      </div>

      {/* BUS TYPE */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Bus Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {["AC", "Non AC", "Seater", "Sleeper"].map((item) => (
            <button
              key={item}
              onClick={() => toggleType(item)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold border transition
                ${filters.busTypes.includes(item)
                  ? "bg-[#d84e55] text-white border-[#d84e55]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#d84e55] hover:text-[#d84e55]"
                }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* PRICE RANGE */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Price Range (₹{filters.priceRange.min} - ₹{filters.priceRange.max})
        </h4>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={filters.priceRange.max}
          onChange={handlePriceRange}
          className="w-full accent-[#d84e55]"
        />
        <div className="flex justify-between text-xs font-semibold text-gray-500 mt-1">
          <span>₹0</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* DEPARTURE TIME */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Departure Time</h4>
        <div className="grid grid-cols-2 gap-2">
          {["Before 10 AM", "10 AM–5 PM", "5 PM–11 PM", "After 11 PM"].map((t) => (
            <button
              key={t}
              onClick={() => toggleTime(t)}
              className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center
                ${filters.departureTimes.includes(t)
                  ? "bg-[#d84e55] text-white border-[#d84e55]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#d84e55] hover:text-[#d84e55]"
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* RATINGS */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Min Rating</h4>
        <div className="flex gap-2">
          {[3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => handleRatingChange(r)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition
                ${filters.minRating === r
                  ? "bg-[#d84e55] text-white border-[#d84e55]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#d84e55] hover:text-[#d84e55]"
                }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");

  const [allBuses, setAllBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expandedCard, setExpandedCard] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    busTypes: [],
    departureTimes: [],
    priceRange: { min: 0, max: 99999 },
    minRating: 0
  });

  // Fetch buses
  useEffect(() => {
    if (!from || !to) {
      setAllBuses([]);
      setFilteredBuses([]);
      return;
    }

    const fetchBuses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/buses/search-buses?origin=${from}&destination=${to}`
        );

        console.log("API RESPONSE:", res.data);

        if (!res.data || !res.data.data) {
          setAllBuses([]);
          setFilteredBuses([]);
          return;
        }

        const formatted = res.data.data.map((bus) => {
          // Normalize bus type for consistent filtering
          let normalizedType = bus.busType || "";
          
          // Convert various formats to standard types
          if (normalizedType.toLowerCase().includes("ac") && normalizedType.toLowerCase().includes("sleeper")) {
            normalizedType = "AC Sleeper";
          } else if (normalizedType.toLowerCase().includes("ac")) {
            normalizedType = "AC";
          } else if (normalizedType.toLowerCase().includes("non ac") || normalizedType.toLowerCase().includes("non-ac")) {
            normalizedType = "Non AC";
          } else if (normalizedType.toLowerCase().includes("seater")) {
            normalizedType = "Seater";
          } else if (normalizedType.toLowerCase().includes("sleeper")) {
            normalizedType = "Sleeper";
          }
          
          console.log("Bus:", bus.busName, "Original Type:", bus.busType, "Normalized Type:", normalizedType);
          
          return {
            id: bus._id,
            name: bus.busName,
            busNumber: bus.busNumber || "",
            type: normalizedType,
            originalType: bus.busType,
            price: bus.price,
            rating: bus.rating || 4,
            departure: bus.departureTime,
            arrival: bus.arrivalTime,
            duration: bus.travelDurationMins ? `${bus.travelDurationMins} mins` : "N/A",
            amenities: bus.amenities || [],
            boarding: bus.boardingPoints || [],
            dropping: bus.droppingPoints || [],
            seats: bus.seats || 40,
            totalSeats: bus.seats || 40,
            seatLayout: bus.seatLayout || [],
          };
        });

        console.log("Formatted Buses:", formatted);
        const maxP = Math.max(...formatted.map(b => b.price), 0);
        setFilters(prev => ({ ...prev, priceRange: { min: 0, max: maxP } }));
        setAllBuses(formatted);
        setFilteredBuses(formatted);
      } catch (err) {
        console.error("API ERROR:", err);
        setAllBuses([]);
        setFilteredBuses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [from, to]);

  // Apply filters whenever filters or allBuses change
  useEffect(() => {
    let filtered = [...allBuses];
    
    console.log("Applying filters:", filters);
    console.log("Total buses before filter:", filtered.length);

    // Filter by bus type (case insensitive)
    if (filters.busTypes.length > 0) {
      filtered = filtered.filter(bus => {
        const matches = filters.busTypes.some(type => 
          bus.type.toLowerCase().includes(type.toLowerCase())
        );
        if (!matches) {
          console.log(`Bus "${bus.name}" (${bus.type}) filtered out by bus type`);
        }
        return matches;
      });
      console.log(`After bus type filter: ${filtered.length} buses`);
    }

    // Filter by price range
    filtered = filtered.filter(bus => {
      const matches = bus.price <= filters.priceRange.max;
      if (!matches) {
        console.log(`Bus "${bus.name}" (₹${bus.price}) filtered out by price`);
      }
      return matches;
    });
    console.log(`After price filter: ${filtered.length} buses`);

    // Filter by rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(bus => {
        const matches = bus.rating >= filters.minRating;
        if (!matches) {
          console.log(`Bus "${bus.name}" (${bus.rating}★) filtered out by rating`);
        }
        return matches;
      });
      console.log(`After rating filter: ${filtered.length} buses`);
    }

    // Filter by departure time
    if (filters.departureTimes.length > 0) {
      filtered = filtered.filter(bus => {
        const departureHour = parseInt(bus.departure.split(":")[0]);
        const isPM = bus.departure.includes("PM");
        let hour = departureHour;
        if (isPM && departureHour !== 12) hour += 12;
        if (!isPM && departureHour === 12) hour = 0;

        const matches = filters.departureTimes.some(timeRange => {
          if (timeRange === "Before 10 AM") return hour < 10;
          if (timeRange === "10 AM–5 PM") return hour >= 10 && hour < 17;
          if (timeRange === "5 PM–11 PM") return hour >= 17 && hour < 23;
          if (timeRange === "After 11 PM") return hour >= 23;
          return false;
        });
        
        if (!matches) {
          console.log(`Bus "${bus.name}" (${bus.departure}) filtered out by departure time`);
        }
        return matches;
      });
      console.log(`After departure time filter: ${filtered.length} buses`);
    }

    // Apply sorting
    if (sortBy === "price_low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "departure") {
      filtered.sort((a, b) => {
        const getHour = (time) => {
          let hour = parseInt(time.split(":")[0]);
          const isPM = time.includes("PM");
          if (isPM && hour !== 12) hour += 12;
          if (!isPM && hour === 12) hour = 0;
          return hour;
        };
        return getHour(a.departure) - getHour(b.departure);
      });
    }

    console.log("Final filtered buses:", filtered.length);
    setFilteredBuses(filtered);
  }, [allBuses, filters, sortBy]);

  const maxPrice = allBuses.length > 0 ? Math.max(...allBuses.map(b => b.price)) : 99999;

  const handleClearAllFilters = () => {
    setFilters({
      busTypes: [],
      departureTimes: [],
      priceRange: { min: 0, max: maxPrice },
      minRating: 0
    });
    setSortBy("");
  };

  const filterCities = (val) =>
    cities.filter((c) => c.toLowerCase().includes(val.toLowerCase()));

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from || !to) {
      alert("Please enter both cities");
      return;
    }
    navigate(`/s-to-d?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen font-sans">
      {/* TOP SEARCH BAR - Same as before */}
      <div className="w-full flex justify-center py-6 px-4 bg-white shadow-sm">
        <div className="bg-gray-200 rounded-[30px] sm:rounded-[40px] px-4 sm:px-6 py-5 w-full max-w-6xl shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-semibold px-2 mb-4">
            <span>BUSES</span>
            <span className="text-gray-700 text-xs sm:text-sm">INDIA'S FASTEST BOOKING PLATFORM</span>
          </div>

          <div className="border-t border-gray-300 mb-4" />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-100 rounded-2xl sm:rounded-full overflow-visible relative">
            {/* FROM */}
            <div className="relative flex items-center gap-3 px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
              <FaMapMarkerAlt className="text-orange-500 shrink-0" />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-semibold">FROM</p>
                <input
                  type="text"
                  value={from}
                  placeholder="Enter city"
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setShowFrom(true);
                  }}
                  onFocus={() => setShowFrom(true)}
                  className="bg-transparent outline-none w-full font-semibold text-lg"
                />
                {showFrom && from && (
                  <div className="absolute top-16 left-0 w-full bg-white shadow rounded z-10 max-h-40 overflow-y-auto">
                    {filterCities(from).map((city, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setFrom(city);
                          setShowFrom(false);
                        }}
                        className="p-2 hover:bg-gray-200 cursor-pointer text-sm"
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SWAP */}
            <div className="hidden sm:flex items-center justify-center">
              <button onClick={handleSwap} className="bg-white p-2 rounded-full shadow">
                <MdSwapHoriz className="text-orange-500 text-xl" />
              </button>
            </div>

            {/* TO */}
            <div className="relative flex items-center gap-3 px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
              <FaMapMarkerAlt className="text-orange-500 shrink-0" />
              <div className="w-full">
                <p className="text-xs text-gray-500 font-semibold">TO</p>
                <input
                  type="text"
                  value={to}
                  placeholder="Enter city"
                  onChange={(e) => {
                    setTo(e.target.value);
                    setShowTo(true);
                  }}
                  onFocus={() => setShowTo(true)}
                  className="bg-transparent outline-none w-full font-semibold text-lg"
                />
                {showTo && to && (
                  <div className="absolute top-16 left-0 w-full bg-white shadow rounded z-10 max-h-40 overflow-y-auto">
                    {filterCities(to).map((city, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setTo(city);
                          setShowTo(false);
                        }}
                        className="p-2 hover:bg-gray-200 cursor-pointer text-sm"
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* DATE */}
            <div className="px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
              <p className="text-xs text-gray-500 font-semibold">DEPARTURE</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent outline-none font-semibold text-lg"
              />
            </div>

            {/* SEARCH BTN */}
            <div className="px-4 py-3 sm:py-0">
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 font-bold text-lg"
              >
                <FaSearch /> SEARCH
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
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
            <FilterContent
              filters={filters}
              setFilters={setFilters}
              onClearAll={handleClearAllFilters}
              availableBusesCount={filteredBuses.length}
              maxPrice={maxPrice}
            />
          </div>
        </div>
      )}

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto mt-6 px-4 pb-10 flex gap-6">
        {/* LEFT FILTER — desktop only */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-4">
            <FilterContent
              filters={filters}
              setFilters={setFilters}
              onClearAll={handleClearAllFilters}
              availableBusesCount={filteredBuses.length}
              maxPrice={maxPrice}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 min-w-0">
          {/* SORT BAR */}
          <div className="bg-white px-4 py-3 rounded-xl shadow-sm flex flex-wrap justify-between items-center gap-2 mb-4">
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold text-[#d84e55] border border-[#d84e55] px-3 py-1.5 rounded-lg"
            >
              <FaSlidersH /> Filters ({filteredBuses.length})
            </button>
            
            <div className="flex flex-wrap gap-3 text-sm font-medium text-gray-500">
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
            </div>
            
            <p className="text-[#d84e55] text-sm font-semibold">
              {filteredBuses.length} buses found • {from} → {to}
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              {/* Road */}
              <div className="relative w-full max-w-lg h-32 overflow-hidden">
                {/* Sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-50 rounded-2xl" />

                {/* Sun */}
                <div className="absolute top-4 right-10 w-10 h-10 bg-yellow-300 rounded-full shadow-lg shadow-yellow-200" />

                {/* Clouds */}
                <div className="absolute top-5 left-8 flex gap-1 animate-[cloudMove_4s_linear_infinite]">
                  <div className="w-8 h-4 bg-white rounded-full opacity-80" />
                  <div className="w-12 h-5 bg-white rounded-full opacity-80 -ml-3" />
                  <div className="w-6 h-3 bg-white rounded-full opacity-80 -ml-2" />
                </div>
                <div className="absolute top-3 left-48 flex gap-1 animate-[cloudMove_6s_linear_infinite]">
                  <div className="w-6 h-3 bg-white rounded-full opacity-60" />
                  <div className="w-10 h-4 bg-white rounded-full opacity-60 -ml-2" />
                </div>

                {/* Road */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-700 rounded-b-2xl" />

                {/* Road dashes */}
                <div className="absolute bottom-4 left-0 right-0 flex gap-4 animate-[roadDash_0.5s_linear_infinite]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-10 h-1.5 bg-yellow-400 rounded-full shrink-0" />
                  ))}
                </div>

                {/* Bus */}
                <div className="absolute bottom-6 animate-[busRide_2s_ease-in-out_infinite]" style={{ left: '10%' }}>
                  {/* Bus body */}
                  <div className="relative">
                    <div className="w-20 h-10 bg-orange-500 rounded-lg shadow-lg shadow-orange-300 relative">
                      {/* Windows */}
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <div className="w-3 h-3 bg-sky-200 rounded-sm opacity-90" />
                        <div className="w-3 h-3 bg-sky-200 rounded-sm opacity-90" />
                        <div className="w-3 h-3 bg-sky-200 rounded-sm opacity-90" />
                        <div className="w-3 h-3 bg-sky-200 rounded-sm opacity-90" />
                      </div>
                      {/* Front */}
                      <div className="absolute right-0 top-0 w-5 h-full bg-orange-600 rounded-r-lg flex items-center justify-center">
                        <div className="w-3 h-2 bg-yellow-300 rounded-sm" />
                      </div>
                      {/* Stripe */}
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-orange-600 rounded-b-lg" />
                    </div>
                    {/* Wheels */}
                    <div className="flex justify-between px-2 -mt-1">
                      <div className="w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600 animate-[spin_0.4s_linear_infinite]">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-auto mt-0.5" />
                      </div>
                      <div className="w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600 animate-[spin_0.4s_linear_infinite]">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mx-auto mt-0.5" />
                      </div>
                    </div>
                    {/* Exhaust */}
                    <div className="absolute -left-3 top-2 flex gap-0.5">
                      <div className="w-1 h-1 bg-gray-400 rounded-full opacity-60 animate-[puff_1s_ease-out_infinite]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full opacity-40 animate-[puff_1s_ease-out_infinite_0.3s]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text */}
              <p className="mt-6 text-gray-600 font-semibold text-base">
                Finding buses for <span className="text-orange-500 font-bold">{from} → {to}</span>
              </p>
              <p className="text-gray-400 text-sm mt-1">Hang tight, we're on the road! 🚌</p>

              <style>{`
                @keyframes busRide {
                  0%, 100% { transform: translateY(0px); }
                  25% { transform: translateY(-3px); }
                  75% { transform: translateY(-1px); }
                }
                @keyframes cloudMove {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(500px); }
                }
                @keyframes roadDash {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-56px); }
                }
                @keyframes puff {
                  0% { transform: scale(1) translateX(0); opacity: 0.6; }
                  100% { transform: scale(2.5) translateX(-8px); opacity: 0; }
                }
              `}</style>
            </div>
          )}

          {/* NO DATA */}
          {!loading && filteredBuses.length === 0 && allBuses.length > 0 && (
            <div className="text-center mt-10">
              <p className="text-red-500 text-lg">No buses match your filters</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filter criteria</p>
              <button
                onClick={handleClearAllFilters}
                className="mt-4 text-[#d84e55] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!loading && allBuses.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-red-500 text-lg">No buses found for this route</p>
              <p className="text-gray-500 text-sm mt-2">Try searching for different cities</p>
            </div>
          )}

          {/* BUS CARDS */}
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              {/* MAIN ROW */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between gap-4">
                {/* LEFT */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <FaBus className="text-orange-500" />
                    <h3 className="font-bold text-lg text-gray-800">{bus.name}</h3>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                      {bus.type}
                    </span>
                    <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                      {bus.rating}★
                    </span>
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
                </div>

                {/* RIGHT */}
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
                      More Details
                      {expandedCard === bus.id ? (
                        <FaChevronUp className="text-xs" />
                      ) : (
                        <FaChevronDown className="text-xs" />
                      )}
                    </button>
                    <button
                      onClick={() => navigate("/seatbook", { state: { busData: {
                        _id: bus.id,
                        busName: bus.name,
                        busNumber: bus.busNumber || "",
                        busType: bus.type,
                        from,
                        to,
                        date,
                        departureTime: bus.departure,
                        arrivalTime: bus.arrival,
                        duration: bus.duration,
                        price: bus.price,
                        totalSeats: bus.totalSeats || 40,
                        seats: bus.seats || 40,
                      }}})}
                      className="bg-[#d84e55] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* EXPANDED DETAILS */}
              {expandedCard === bus.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 sm:px-5 py-5">
                  {/* TRAVEL DURATION BAR */}
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
                    {/* AMENITIES */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {bus.amenities.map((a, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-sm"
                          >
                            {amenityIcon(a)} {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* BOARDING */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Boarding Points</h4>
                      <div className="space-y-2">
                        {bus.boarding.map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DROPPING */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-3">Dropping Points</h4>
                      <div className="space-y-2">
                        {bus.dropping.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                            {d}
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
    </div>
  );
};

export default SearchResult;