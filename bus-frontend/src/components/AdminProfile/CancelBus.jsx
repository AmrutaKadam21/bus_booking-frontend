import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BusAdmin() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const busesPerPage = 8;

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/buses");
      setBuses(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this bus?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/buses/delete/${id}`);
      alert("Bus cancelled successfully");
      fetchBuses();
    } catch (error) {
      console.log(error);
      alert("Error cancelling bus");
    }
  };

  // 🔥 PAGINATION LOGIC
  const indexOfLastBus = currentPage * busesPerPage;
  const indexOfFirstBus = indexOfLastBus - busesPerPage;
  const currentBuses = buses.slice(indexOfFirstBus, indexOfLastBus);

  const totalPages = Math.ceil(buses.length / busesPerPage);

  if (loading) {
    return <h2 className="text-center mt-10">Loading buses...</h2>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      
      {/* HEADER */}
      <h2 className="text-3xl font-bold mb-6 text-orange-600">
        🚍 Bus Admin Panel
      </h2>

      <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow rounded-xl overflow-x-auto">
        
        {/* TABLE */}
        <table className="w-full min-w-[500px]">
          
          {/* ORANGE HEADER */}
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-4">#</th>
              <th>Bus Name</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentBuses.map((bus, index) => (
              <tr
                key={bus._id}
                className="border-b text-center hover:bg-orange-50 transition"
              >
                <td className="p-3">
                  {indexOfFirstBus + index + 1}
                </td>

                <td className="font-medium">
                  {bus.busName || "-"}
                  <div className="text-xs text-gray-400 font-normal">{bus.busNumber || ""}</div>
                </td>
                <td>{bus.from}</td>
                <td>{bus.to}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      bus.status === "cancelled"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  >
                    {bus.status === "cancelled" ? "Cancelled" : "Active"}
                  </span>
                </td>

                {/* ACTION */}
                <td>
                  <button
                    onClick={() => handleCancel(bus._id)}
                    disabled={bus.status === "cancelled"}
                    className={`px-4 py-1 rounded text-white transition ${
                      bus.status === "cancelled"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-700"
                    }`}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION CONTROLS */}
        <div className="flex flex-wrap justify-center items-center gap-4 p-4 bg-orange-50">
          
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>

        </div>
      </div>
    </div>
  );
}