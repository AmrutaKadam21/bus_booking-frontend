import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewBuses() {
  const [buses, setBuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBus, setSelectedBus] = useState(null);

  const busesPerPage = 8; 

  const fetchBuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/buses");
      console.log("BUS DATA FROM API:", res.data);
      console.log("FIRST BUS KEYS:", res.data[0] ? Object.keys(res.data[0]) : "no data");
      setBuses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  // PAGINATION
  const indexOfLastBus = currentPage * busesPerPage;
  const indexOfFirstBus = indexOfLastBus - busesPerPage;
  const currentBuses = buses.slice(indexOfFirstBus, indexOfLastBus);

  return (
    <div className="p-6 min-h-screen bg-white">

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        All Buses 🚍
      </h1>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow overflow-x-auto">

        <table className="w-full text-left min-w-[500px]">

          <thead className="bg-gray-50">
            <tr className="text-gray-600 text-sm">
              <th className="p-3">No.</th>
              <th className="p-3">Bus</th>
              <th className="p-3">Route</th>
              <th className="p-3">Price</th>
              <th className="p-3">Time</th>
              <th className="p-3 text-center">Details</th>
            </tr>
          </thead>

          <tbody>
            {currentBuses.length > 0 ? (
              currentBuses.map((bus, index) => (
                <tr key={bus._id} className="border-t hover:bg-gray-50">

                  {/* 🔥 SERIAL NUMBER */}
                  <td className="p-3 font-medium text-gray-700">
                    {indexOfFirstBus + index + 1}
                  </td>

                  <td className="p-3 font-medium">
                    {bus.busName || "-"}
                    <div className="text-xs text-gray-500">{bus.busNumber || "-"}</div>
                  </td>

                  <td className="p-3 font-medium">
                    {bus.from} → {bus.to}
                  </td>

                  <td className="p-3">
                    ₹{bus.price}
                  </td>

                  <td className="p-3 text-sm text-gray-600">
                    {bus.departureTime} - {bus.arrivalTime}
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedBus(bus)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      View
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No buses found 🚫
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-wrap justify-between items-center gap-3 mt-6">

        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium">
          Page {currentPage} of {Math.ceil(buses.length / busesPerPage)} | Total: {buses.length}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastBus >= buses.length}
          className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

      {/* MODAL */}
      {selectedBus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-lg overflow-hidden">

            {/* MODAL HEADER */}
            <div className="bg-orange-50 px-6 py-4 flex justify-between items-center border-b border-orange-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedBus.busName || "Bus Details"}</h2>
                <p className="text-gray-500 text-sm">{selectedBus.busNumber || ""}</p>
              </div>
              {selectedBus.busType && (
                <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedBus.busType}
                </span>
              )}
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">

              {/* ROUTE + TIMING */}
              <div className="bg-orange-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3">Route & Timing</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">{selectedBus.departureTime || "-"}</p>
                    <p className="text-xs text-gray-500">{selectedBus.from}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-3">
                    {selectedBus.travelDurationMins && (
                      <p className="text-xs text-orange-500 font-semibold mb-1">{selectedBus.travelDurationMins} mins</p>
                    )}
                    <div className="w-full flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-green-400 to-red-400" />
                      <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">{selectedBus.arrivalTime || "-"}</p>
                    <p className="text-xs text-gray-500">{selectedBus.to}</p>
                  </div>
                </div>
              </div>

              {/* PRICE + SEATS + RATING */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Price</p>
                  <p className="text-lg font-bold text-orange-500">₹{selectedBus.price}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Seats</p>
                  <p className="text-lg font-bold text-gray-800">{selectedBus.seats}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Rating</p>
                  <p className="text-lg font-bold text-yellow-500">
                    {selectedBus.rating ? `${selectedBus.rating} ★` : "-"}
                  </p>
                </div>
              </div>

              {/* AMENITIES */}
              {selectedBus.amenities?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBus.amenities.map((a, i) => (
                      <span key={i} className="bg-blue-50 text-blue-600 border border-blue-100 text-xs px-3 py-1 rounded-full font-medium">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* BOARDING + DROPPING */}
              {(selectedBus.boardingPoints?.length > 0 || selectedBus.droppingPoints?.length > 0) && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {selectedBus.boardingPoints?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Boarding Points</p>
                      <div className="space-y-1">
                        {selectedBus.boardingPoints.map((b, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />{b}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedBus.droppingPoints?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Dropping Points</p>
                      <div className="space-y-1">
                        {selectedBus.droppingPoints.map((d, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />{d}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="px-6 pb-5">
              <button
                onClick={() => setSelectedBus(null)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}