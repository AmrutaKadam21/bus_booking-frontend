import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doLogout } from "../Layout/Header";
import {
  FaBus,
  FaTimesCircle,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const cards = [
    {
      title: "Upcoming Trips",
      desc: "View your scheduled journeys",
      icon: <FaBus />,
      path: "/bookings",
    },
    {
      title: "Cancelled",
      desc: "View cancelled bookings",
      icon: <FaTimesCircle />,
      path: "/cancellations",
    },
    {
      title: "Tickets",
      desc: "Download your tickets",
      icon: <FaTicketAlt />,
      path: "/tickets",
    },
    {
      title: "Live Tracking",
      desc: "Track bus in real-time",
      icon: <FaMapMarkerAlt />,
      path: "/livetracking",
    },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50 flex">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT PANEL */}
      <div
        className={`fixed md:static z-30 top-0 left-0 h-full w-64 md:w-1/5 min-h-screen p-6 flex flex-col justify-between shadow-xl text-white transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "linear-gradient(180deg, #1f2937, #374151, #ea580c)" }}
      >
        {/* USER INFO */}
        <div className="text-center">
          <button
            className="md:hidden absolute top-4 right-4 text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>

          <FaUserCircle className="text-7xl text-orange-500 mx-auto mb-3" />

          <h2 className="text-2xl font-bold text-white">
            {user?.name || "User"}
          </h2>

          <p className="text-white text-sm">
            {user?.email}
          </p>

          <button
            onClick={() => doLogout(navigate)}
            className="mt-20 p-7 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 min-w-0 p-4 sm:p-8 space-y-8">

        {/* MOBILE TOPBAR */}
        <div className="md:hidden flex items-center gap-3 mb-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 text-xl"
          >
            <FaBars />
          </button>
          <span className="font-semibold text-gray-700">My Profile</span>
        </div>

        {/* HEADER */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, <span className="text-orange-500">{user?.name}</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your travel easily 🚍
            </p>
          </div>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {cards.map((card, i) => (
            <div
              key={i}
              onClick={() => navigate(card.path)}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 cursor-pointer
              hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl text-orange-500 mb-4">
                {card.icon}
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                {card.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {card.desc}
              </p>

              <div className="mt-4 text-orange-500 font-medium">
                View →
              </div>
            </div>
          ))}

        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">

          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Recent Activity
          </h2>

          <p className="text-gray-500 text-sm">
            Your recent bookings and actions will appear here.
          </p>

        </div>

      </div>
    </div>
  );
}