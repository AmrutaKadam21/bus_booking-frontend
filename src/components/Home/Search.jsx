import React, { useState } from "react";
import { createPortal } from "react-dom";
import { FaMapMarkerAlt, FaSearch, FaTimes } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useCities from "../../hooks/useCities";

// Get today's date in LOCAL timezone (not UTC) — prevents IST offset giving yesterday
const getToday = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const today = getToday();

const Search = () => {
  const cities = useCities();
  const [from, setFrom] = useState("");
  const [to,   setTo]   = useState("");
  const [date, setDate] = useState("");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo,   setShowTo]   = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();

  const filterCities = (val) =>
    val ? cities.filter((c) => c.toLowerCase().includes(val.toLowerCase())) : cities;

  const handleSwap = () => { setFrom(to); setTo(from); };
  const isLoggedIn = () => !!localStorage.getItem("user");

  const handleFromFocus = () => {
    setShowFrom(true);
  };

  const handleSearch = () => {
    if (!from.trim()) { alert("Please enter the departure city (From)"); return; }
    if (!to.trim())   { alert("Please enter the destination city (To)"); return; }
    if (!date)        { alert("Please select a departure date"); return; }
    navigate(`/s-to-d?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <div className="bg-gray-200 rounded-[30px] sm:rounded-[40px] px-4 sm:px-6 py-5 sm:py-6 w-full max-w-6xl shadow-md">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-semibold px-2 mb-4">
          <span>🚌 BUSES</span>
          <span className="text-gray-700 text-xs sm:text-sm">INDIA'S FASTEST BOOKING PLATFORM</span>
        </div>

        <div className="border-t border-gray-300 mb-4" />

        <div className="flex flex-col sm:flex-row items-stretch bg-gray-100 rounded-2xl sm:rounded-full relative" style={{zIndex: 100}}>

          {/* FROM */}
          <div className="relative flex items-center gap-3 px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
            <FaMapMarkerAlt className="text-orange-500 shrink-0" />
            <div className="w-full">
              <p className="text-xs text-gray-500 font-semibold">FROM <span className="text-red-400">*</span></p>
              <input
                type="text"
                value={from}
                placeholder="Enter city"
                onFocus={handleFromFocus}
                onChange={(e) => { setFrom(e.target.value); setShowFrom(true); }}
                onBlur={() => setTimeout(() => setShowFrom(false), 150)}
                className="bg-transparent outline-none w-full font-semibold text-lg"
              />
              {showFrom && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg z-50 max-h-48 overflow-y-auto border border-gray-100 mt-1">
                  {filterCities(from).map((city, i) => (
                    <div key={i} onMouseDown={() => { setFrom(city); setShowFrom(false); }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700">
                      <FaMapMarkerAlt className="text-orange-400 text-xs shrink-0" />{city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SWAP */}
          <div className="hidden sm:flex items-center justify-center px-1">
            <button onClick={handleSwap} className="bg-white p-2 rounded-full shadow hover:shadow-md transition">
              <MdSwapHoriz className="text-orange-500 text-xl" />
            </button>
          </div>

          {/* TO */}
          <div className="relative flex items-center gap-3 px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
            <FaMapMarkerAlt className="text-orange-500 shrink-0" />
            <div className="w-full">
              <p className="text-xs text-gray-500 font-semibold">TO <span className="text-red-400">*</span></p>
              <input
                type="text"
                value={to}
                placeholder="Enter city"
                onFocus={() => setShowTo(true)}
                onChange={(e) => { setTo(e.target.value); setShowTo(true); }}
                onBlur={() => setTimeout(() => setShowTo(false), 150)}
                className="bg-transparent outline-none w-full font-semibold text-lg"
              />
              {showTo && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg z-50 max-h-48 overflow-y-auto border border-gray-100 mt-1">
                  {filterCities(to).map((city, i) => (
                    <div key={i} onMouseDown={() => { setTo(city); setShowTo(false); }}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700">
                      <FaMapMarkerAlt className="text-orange-400 text-xs shrink-0" />{city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DATE — always visible, min=today (local timezone), past dates blocked */}
          <div className="px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300 flex flex-col justify-center">
            <p className="text-xs text-gray-500 font-semibold">DEPARTURE <span className="text-red-400">*</span></p>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                // Extra guard: reject any date before today even if typed manually
                if (e.target.value && e.target.value < today) return;
                setDate(e.target.value);
              }}
              className="bg-transparent outline-none font-semibold text-base text-gray-800 cursor-pointer w-full"
            />
          </div>

          {/* SEARCH */}
          <div className="flex items-stretch px-3 py-2 sm:py-0">
            <button
              onClick={handleSearch}
              className="self-stretch sm:my-2 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 rounded-full flex items-center justify-center gap-2 font-bold text-base transition"
            >
              <FaSearch /> SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* Auth popup — portaled into #modal-root which is outside #root entirely */}
      {showAuthPopup && createPortal(
        <div
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)", zIndex:99999, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", pointerEvents:"auto" }}
        >
          <div style={{ background:"#fff", borderRadius:"1rem", padding:"2rem", width:"100%", maxWidth:"360px", boxShadow:"0 25px 60px rgba(0,0,0,0.35)", position:"relative" }}>
            <button onClick={() => setShowAuthPopup(false)} style={{ position:"absolute", top:"1rem", right:"1rem", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", fontSize:"1.1rem" }}>
              <FaTimes />
            </button>
            <div style={{ textAlign:"center", marginBottom:"1.5rem" }}>
              <div style={{ width:"3.5rem", height:"3.5rem", background:"#fff7ed", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 1rem" }}>
                <FaMapMarkerAlt style={{ color:"#f97316", fontSize:"1.5rem" }} />
              </div>
              <h3 style={{ fontSize:"1.25rem", fontWeight:700, color:"#111827", margin:0 }}>Login to Search Buses</h3>
              <p style={{ fontSize:"0.875rem", color:"#6b7280", marginTop:"0.5rem" }}>Please login or register to search and book buses.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              <button onClick={() => { setShowAuthPopup(false); navigate("/login"); }}
                style={{ width:"100%", background:"#f97316", color:"#fff", border:"none", borderRadius:"0.75rem", padding:"0.75rem", fontWeight:700, fontSize:"1rem", cursor:"pointer" }}>
                Login
              </button>
              <button onClick={() => { setShowAuthPopup(false); navigate("/register"); }}
                style={{ width:"100%", background:"#fff", color:"#f97316", border:"2px solid #f97316", borderRadius:"0.75rem", padding:"0.75rem", fontWeight:700, fontSize:"1rem", cursor:"pointer" }}>
                Register
              </button>
            </div>
          </div>
        </div>,
        document.getElementById("modal-root")
      )}
    </div>
  );
};

export default Search;
