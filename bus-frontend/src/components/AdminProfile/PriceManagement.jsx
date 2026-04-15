import React, { useState } from "react";
import axios from "axios";
import {
  FaRupeeSign, FaSearch, FaBus, FaTag, FaCheckCircle,
  FaArrowUp, FaArrowDown, FaPercent,
} from "react-icons/fa";

const QUICK_ADJUSTMENTS = [
  { label: "+5%",  type: "percent", value: 5,   color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { label: "+10%", type: "percent", value: 10,  color: "bg-green-100 text-green-700 hover:bg-green-200" },
  { label: "-5%",  type: "percent", value: -5,  color: "bg-red-100 text-red-700 hover:bg-red-200" },
  { label: "-10%", type: "percent", value: -10, color: "bg-red-100 text-red-700 hover:bg-red-200" },
];

export default function PriceManagement() {
  const [busNumber, setBusNumber] = useState("");
  const [bus, setBus]             = useState(null);
  const [newPrice, setNewPrice]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);

  // ── SEARCH ──────────────────────────────────────────────
  const handleSearch = async () => {
    if (!busNumber.trim()) return;
    setLoading(true);
    setSuccess(false);
    setBus(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/buses/by-number/${busNumber}`
      );
      if (!res.data || res.data.message) { alert("Bus not found"); return; }
      setBus(res.data);
      setNewPrice(res.data.price ?? "");
    } catch {
      alert("Error fetching bus");
    } finally {
      setLoading(false);
    }
  };

  // ── QUICK ADJUST ────────────────────────────────────────
  const applyQuick = ({ type, value }) => {
    const base = parseFloat(newPrice) || bus.price;
    if (type === "percent") {
      setNewPrice(Math.max(0, Math.round(base + (base * value) / 100)).toString());
    }
  };

  // ── UPDATE ──────────────────────────────────────────────
  const handleUpdate = async () => {
  if (!newPrice || isNaN(newPrice) || Number(newPrice) <= 0) {
    alert("Enter a valid price");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.put(
  `http://localhost:5000/api/buses/price/${bus._id}`,  
  { price: Number(newPrice) }
);

    console.log("Update Response:", res.data); 

    setBus(res.data.data); 
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message); 
    alert(err.response?.data?.message || "Update failed");
  } finally {
    setLoading(false);
  }
};



  const diff = bus ? Number(newPrice) - bus.price : 0;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaRupeeSign className="text-orange-500" />
            Price Management
          </h1>
          <p className="text-gray-500 mt-2">Search a bus and update its ticket price</p>
        </div>

        {/* SEARCH CARD */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaSearch className="text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-700">Find Bus</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Enter Bus Number (e.g. MH12AB1234)"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaSearch />
              )}
              Search
            </button>
          </div>
        </div>

        {/* MAIN PANEL */}
        {bus ? (
          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT — BUS INFO */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-5">
                <FaBus className="text-orange-600 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Bus Details</h3>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Bus Name",   value: bus.busName },
                  { label: "Bus Number", value: bus.busNumber },
                  { label: "Route",      value: `${bus.from} → ${bus.to}` },
                  { label: "Type",       value: bus.busType || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl px-4 py-3 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-shadow flex justify-between items-center">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                ))}

                {/* CURRENT PRICE HIGHLIGHT */}
                <div className="bg-orange-500 rounded-xl px-4 py-4 shadow-[0_8px_20px_rgba(249,115,22,0.4)] flex justify-between items-center mt-2">
                  <span className="text-orange-100 font-medium">Current Price</span>
                  <span className="text-2xl font-bold text-white flex items-center gap-1">
                    <FaRupeeSign className="text-lg" />{bus.price}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — PRICE EDITOR */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow p-6">
              <div className="flex items-center gap-2 mb-5">
                <FaTag className="text-green-500 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Update Price</h3>
              </div>

              {/* SUCCESS BANNER */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
                  <FaCheckCircle />
                  <span className="font-medium">Price updated successfully!</span>
                </div>
              )}

              {/* NEW PRICE INPUT */}
              <label className="block text-sm font-medium text-gray-700 mb-2">New Price (₹)</label>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-lg font-semibold"
                />
              </div>

              {/* DIFF BADGE */}
              {newPrice !== "" && diff !== 0 && (
                <div className={`flex items-center gap-2 text-sm font-medium mb-4 px-3 py-2 rounded-lg ${diff > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {diff > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {diff > 0 ? "+" : ""}₹{diff} from current price
                  <span className="ml-auto opacity-70">
                    ({diff > 0 ? "+" : ""}{((diff / bus.price) * 100).toFixed(1)}%)
                  </span>
                </div>
              )}

              {/* QUICK ADJUSTMENTS */}
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                  <FaPercent className="text-xs" /> Quick Adjust
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {QUICK_ADJUSTMENTS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => applyQuick(q)}
                      className={`py-2 rounded-lg text-sm font-semibold transition ${q.color}`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPDATE BTN */}
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaCheckCircle />
                )}
                Update Price
              </button>
            </div>

          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-12 text-center">
            <FaRupeeSign className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bus Selected</h3>
            <p className="text-gray-500">Search for a bus number to view and update its price</p>
          </div>
        )}

      </div>
    </div>
  );
}
