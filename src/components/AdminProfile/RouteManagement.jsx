import React, { useState } from "react";
import axios from "axios";
import { FaSearch, FaBus, FaMapMarkerAlt, FaClock, FaEdit, FaCheckCircle } from "react-icons/fa";
import API from "../../config/api";

export default function RouteManagement() {
  const [busNumber, setBusNumber] = useState("");
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
  });

  // 🔍 SEARCH BUS
  const handleSearch = async () => {
    if (!busNumber.trim()) {
      alert("Please enter a bus number");
      return;
    }

    setLoading(true);
    setSuccess(false);
    try {
      const res = await axios.get(`${API}/api/buses/by-number/${busNumber}`);

      if (!res.data || res.data.message) {
        alert("Bus not found");
        setBus(null);
        return;
      }

      setBus(res.data);
      setForm({
        from: res.data.from || "",
        to: res.data.to || "",
        departureTime: res.data.departureTime || "",
        arrivalTime: res.data.arrivalTime || "",
      });
    } catch (err) {
      console.log(err);
      alert("Error fetching bus");
      setBus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.from || !form.to || !form.departureTime || !form.arrivalTime) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API}/api/buses/update-route/${bus._id}`,
        {
          from: form.from,
          to: form.to,
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
        }
      );

      setBus(response.data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaEdit className="text-orange-500" />
            Route Management
          </h1>
          <p className="text-gray-500 mt-2">Search and update bus route information</p>
        </div>

        {/* SEARCH CARD */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaSearch className="text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-700">Search Bus</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Enter Bus Number (e.g., MH12AB1234)"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />

            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* BUS INFO + EDIT FORM */}
        {bus && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* CURRENT INFO CARD */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow p-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-4">
                <FaBus className="text-orange-600 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Current Route Info</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-shadow">
                  <p className="text-sm text-gray-500 mb-1">Bus Name</p>
                  <p className="text-lg font-bold text-gray-800">{bus.busName}</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-shadow">
                  <p className="text-sm text-gray-500 mb-1">Bus Number</p>
                  <p className="text-lg font-bold text-gray-800">{bus.busNumber}</p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-green-500" />
                    <p className="text-sm text-gray-500">Route</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">
                    {bus.from} → {bus.to}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <FaClock className="text-blue-500" />
                    <p className="text-sm text-gray-500">Timings</p>
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Departure:</span> {bus.departureTime}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Arrival:</span> {bus.arrivalTime}
                  </p>
                </div>
              </div>
            </div>

            {/* EDIT FORM CARD */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaEdit className="text-green-500 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Update Route</h3>
              </div>

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
                  <FaCheckCircle />
                  <span className="font-medium">Route updated successfully!</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From (Origin)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Pune"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To (Destination)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mumbai"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={form.departureTime}
                    onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    value={form.arrivalTime}
                    onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full mt-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Update Route
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* EMPTY STATE */}
        {!bus && !loading && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-12 text-center">
            <FaBus className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bus Selected</h3>
            <p className="text-gray-500">Search for a bus number to view and edit route details</p>
          </div>
        )}

      </div>
    </div>
  );
}