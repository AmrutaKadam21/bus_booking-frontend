import React, { useState, useEffect } from "react";
import { FaBus, FaPlus, FaEdit, FaTrash, FaRoute, FaBars, FaTimes, FaSignOutAlt, FaRupeeSign, FaUsers } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../config/api";

import AddBus from "./AddBus";
import ViewBuses from "./ViewBuses";
import CancelBus from "./CancelBus";
import SeatManagement from "./SeatManagement";
import RouteManagement from "./RouteManagement";
import PriceManagement from "./PriceManagement";

export default function AdminDashboard() {

  function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
        ${active
          ? "bg-orange-500 text-white shadow-lg"
          : "hover:bg-white/10 text-gray-200"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setAdminUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [stats, setStats] = useState({ totalBuses: 0, totalBookings: 0, recentBuses: [] });

  const fetchStats = async () => {
    try {
      const [busRes, bookingRes] = await Promise.all([
        axios.get(`${API}/api/buses`),
        axios.get(`${API}/api/bookings/all`).catch(() => ({ data: { data: [] } })),
      ]);
      const buses = busRes.data || [];
      const bookings = bookingRes.data?.data || [];
      setStats({
        totalBuses: buses.length,
        totalBookings: bookings.length,
        recentBuses: buses.slice(0, 5),
      });
    } catch (e) {
      console.error("Failed to fetch stats", e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get(`${API}/api/auth/users`);
      setUsers(res.data.data || []);
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (active === "Registered Users") fetchUsers();
    if (active === "Dashboard") fetchStats();
  }, [active]);

  const handleNav = (label) => {
    setActive(label);
    setSidebarOpen(false);
  };

  // 🔁 RENDER BASED ON CLICK
  const renderContent = () => {
    switch (active) {
      case "Add Bus":
        return <AddBus />;
      case "View All Buses":
        return <ViewBuses />;
      case "Cancel Bus":
        return <CancelBus />;
      case "Seat Management":
        return <SeatManagement />;
      case "Route Management":
        return <RouteManagement />;
      case "Price Management":
        return <PriceManagement />;

      case "Registered Users":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Registered Users</h1>
            {usersLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-500">{users.length} total users</p>
                  <button onClick={fetchUsers} className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition">
                    Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">#</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Phone</th>
                        <th className="px-6 py-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u, i) => (
                        <tr key={u._id} className="hover:bg-orange-50 transition-colors">
                          <td className="px-6 py-4 text-gray-400">{i + 1}</td>
                          <td className="px-6 py-4 font-semibold text-gray-800">{u.name}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4 text-gray-600">{u.phone || "—"}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              u.role === "admin"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-gray-100 text-gray-500"
                            }`}>
                              {u.role || "user"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FaBus className="text-orange-500" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-500">Total Buses</h2>
                </div>
                <p className="text-4xl font-bold text-orange-500">{stats.totalBuses}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaRoute className="text-blue-500" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-500">Active Routes</h2>
                </div>
                <p className="text-4xl font-bold text-blue-500">{stats.totalBuses}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaUsers className="text-green-500" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-500">Total Bookings</h2>
                </div>
                <p className="text-4xl font-bold text-green-500">{stats.totalBookings}</p>
              </div>
            </div>

            {/* RECENT BUSES TABLE */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow border border-gray-100 overflow-x-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Buses</h2>
              <table className="w-full text-left min-w-[400px] text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-wider border-b">
                    <th className="pb-3 px-2">Bus Name</th>
                    <th className="pb-3 px-2">Route</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2">Price</th>
                    <th className="pb-3 px-2">Seats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentBuses.map(bus => (
                    <tr key={bus._id} className="hover:bg-orange-50 transition-colors">
                      <td className="py-3 px-2 font-medium text-gray-800">{bus.busName}<div className="text-xs text-gray-400">{bus.busNumber}</div></td>
                      <td className="py-3 px-2 text-gray-600">{bus.from} → {bus.to}</td>
                      <td className="py-3 px-2 text-gray-600">{bus.busType || "—"}</td>
                      <td className="py-3 px-2 font-semibold text-orange-500">₹{bus.price}</td>
                      <td className="py-3 px-2 text-gray-600">{bus.seats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed md:static z-30 top-0 left-0 h-full w-64 min-h-screen bg-gradient-to-b from-[#3b1d0f] via-[#5a2e12] to-[#8b4513] text-white shadow-xl flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
            {adminUser && (
              <p className="text-orange-300 text-sm mt-1 truncate">{adminUser.name || adminUser.email}</p>
            )}
          </div>
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-6 space-y-2 px-3">
          <SidebarItem icon={<AiOutlineDashboard />} label="Dashboard" active={active === "Dashboard"} onClick={() => handleNav("Dashboard")} />
          <SidebarItem icon={<FaPlus />} label="Add Bus" active={active === "Add Bus"} onClick={() => handleNav("Add Bus")} />
          <SidebarItem icon={<FaBus />} label="View All Buses" active={active === "View All Buses"} onClick={() => handleNav("View All Buses")} />
          <SidebarItem icon={<FaTrash />} label="Cancel Bus" active={active === "Cancel Bus"} onClick={() => handleNav("Cancel Bus")} />
          <SidebarItem icon={<MdEventSeat />} label="Seat Management" active={active === "Seat Management"} onClick={() => handleNav("Seat Management")} />
          <SidebarItem icon={<FaRoute />} label="Route Management" active={active === "Route Management"} onClick={() => handleNav("Route Management")} />
          <SidebarItem icon={<FaRupeeSign />} label="Price Management" active={active === "Price Management"} onClick={() => handleNav("Price Management")} />
          <SidebarItem icon={<FaUsers />} label="Registered Users" active={active === "Registered Users"} onClick={() => handleNav("Registered Users")} />
        

        {/* LOGOUT */}
        {/* <div className="px-1 pb-1 "> */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        {/* </div> */}</nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-white min-w-0">
        {/* MOBILE TOPBAR */}
        <div className="md:hidden flex items-center gap-3 p-4 bg-[#5a2e12] text-white">
          <button onClick={() => setSidebarOpen(true)}><FaBars /></button>
          <span className="font-semibold">{active}</span>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}