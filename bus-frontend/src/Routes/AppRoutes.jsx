import React from 'react'
import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"
import { Routes, Route } from "react-router-dom"
import Service from '../pages/Service'
import Busdetails from '../pages/Busdetails'
import Register from '../components/Auth/Register'
import Login from '../components/Auth/Login'
import Dashboard from "../components/UserProfilePage/Dashboard";
import Bookings from "../components/UserProfilePage/Bookings";
import Tickets from "../components/UserProfilePage/Tickets";
import Cancellations from "../components/UserProfilePage/Cancellations";
import LiveTracking from "../components/UserProfilePage/LiveTracking";
import AdminDashboard from '../components/AdminProfile/AdminDashboard'
import SeatBook from '../components/BusBooking/SeatBook'

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/s-to-d" element={<Busdetails />} />        <Route path="/Contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Service" element={<Service />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/cancellations" element={<Cancellations />} />
        <Route path="/livetracking" element={<LiveTracking />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/seatbook" element={<SeatBook />} />
      </Routes>
    </div>
  )
}

export default AppRoutes
