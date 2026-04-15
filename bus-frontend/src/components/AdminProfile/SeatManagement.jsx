import React, { useState } from "react";
import axios from "axios";
import { FaSearch, FaBus, FaWheelchair } from "react-icons/fa";

const HANDICAP_SEATS = ["3", "4", "7", "8"];
const TODAY = new Date().toISOString().split("T")[0];
const CARD = "bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow";

export default function SeatManagement() {
  const [busNumber, setBusNumber] = useState("");
  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(TODAY);

  const handleSearch = async () => {
    if (!busNumber.trim()) { alert("Please enter a bus number"); return; }
    setLoading(true);
    setBus(null);
    setSeats([]);
    try {
      const busRes = await axios.get(`http://localhost:5000/api/buses/by-number/${busNumber}`);
      if (!busRes.data || busRes.data.message) { alert("Bus not found"); return; }
      const busData = busRes.data;
      setBus(busData);
      const seatRes = await axios.get(`http://localhost:5000/api/buses/seat-status/${busData._id}?date=${date}`);
      const { totalSeats, bookedSeats } = seatRes.data;
      const total = totalSeats || busData.seats || 40;
      setSeats(Array.from({ length: total }, (_, i) => {
        const num = String(i + 1);
        return { seatNumber: num, isHandicap: HANDICAP_SEATS.includes(num), booked: bookedSeats.includes(num) };
      }));
    } catch {
      alert("Error fetching bus data");
    } finally {
      setLoading(false);
    }
  };

  const booked    = seats.filter(s => s.booked).length;
  const available = seats.filter(s => !s.booked).length;
  const handicap  = seats.filter(s => s.isHandicap).length;

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaBus className="text-orange-500" /> Seat Management
          </h1>
          <p className="text-gray-500 mt-2">Search a bus to view its seat layout and availability</p>
        </div>

        {/* SEARCH */}
        <div className={`${CARD} p-6 mb-6`}>
          <div className="flex items-center gap-2 mb-4">
            <FaSearch className="text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-700">Search Bus</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Enter Bus Number (e.g. MH12AB1001)"
              value={busNumber}
              onChange={e => setBusNumber(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSearch />}
              Search
            </button>
          </div>
        </div>

        {bus && seats.length > 0 && (
          <>
            {/* BUS INFO */}
            <div className={`${CARD} p-5 mb-6`}>
              <p className="text-lg font-bold text-gray-800">{bus.busName} <span className="text-sm font-normal text-gray-500">({bus.busNumber})</span></p>
              <p className="text-sm text-gray-500 mt-1">{bus.from} → {bus.to} &nbsp;|&nbsp; {bus.departureTime} - {bus.arrivalTime}</p>
            </div>

            {/* COUNTS */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Available", count: available, dot: "bg-green-500" },
                { label: "Booked",    count: booked,    dot: "bg-red-500"   },
                { label: "Handicap",  count: handicap,  dot: "bg-blue-400"  },
              ].map(({ label, count, dot }) => (
                <div key={label} className={`${CARD} p-5 text-center`}>
                  <div className={`w-10 h-10 ${dot} rounded-full mx-auto mb-2`} />
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            {/* LEGEND */}
            <div className={`${CARD} p-5 mb-6`}>
              <div className="flex flex-wrap gap-5">
                {[
                  { color: "bg-green-500", label: "Available" },
                  { color: "bg-red-500",   label: "Booked" },
                  { color: "bg-blue-400",  label: "Handicap Friendly" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded ${color}`} />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEAT GRID */}
            <div className={`${CARD} p-6`}>
              <div className="mb-4 flex justify-center">
                <div className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-semibold">✇ DRIVER</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {seats.map(seat => (
                  <div
                    key={seat.seatNumber}
                    className={`relative p-3 rounded-lg text-center font-semibold shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-white
                      ${seat.booked ? "bg-red-500" : seat.isHandicap ? "bg-blue-400" : "bg-green-500"}`}
                  >
                    <div className="text-sm">{seat.seatNumber}</div>
                    <div className="text-xs mt-1 opacity-80">
                      {seat.booked ? "Booked" : seat.isHandicap ? "Handicap" : "Available"}
                    </div>
                    {seat.isHandicap && !seat.booked && <FaWheelchair className="absolute top-1 right-1 text-xs" />}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!bus && !loading && (
          <div className={`${CARD} p-12 text-center`}>
            <FaBus className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bus Selected</h3>
            <p className="text-gray-500">Search a bus number to view its seat layout</p>
          </div>
        )}

      </div>
    </div>
  );
}
