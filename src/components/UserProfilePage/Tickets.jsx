import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import downloadTicket from "../BusBooking/DownloadTicket";
import API from "../../config/api";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const Skeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-5">
    <div className="flex justify-between">
      <div className="h-5 w-48 bg-gray-100 rounded" />
      <div className="h-5 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
    </div>
    <div className="flex gap-3 pt-2">
      <div className="h-9 w-28 bg-gray-100 rounded-xl" />
      <div className="h-9 w-20 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

export default function Tickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/api/bookings/user/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTickets(res.data.data.filter((b) => b.bookingStatus === "confirmed")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Map API booking data → shape expected by existing downloadTicket function
  const handleDownload = (t) => {
    const passenger = t.passengers?.[0] || {};
    const perSeat = t.selectedSeats?.length
      ? Math.round(t.totalAmount / t.selectedSeats.length)
      : t.totalAmount;

    const busData = {
      busName: t.busName || "N/A",
      busNumber: t.busNumber || "N/A",
      busType: t.busType || "N/A",
      from: t.from,
      to: t.to,
      date: fmt(t.travelDate),
      departureTime: t.departureTime || "N/A",
      arrivalTime: t.arrivalTime || "N/A",
      price: perSeat,
    };

    // downloadTicket expects: selectedSeats = array of seat ids (numbers)
    // and seats = array of { id, seatNumber } to look up by id
    const seats = t.selectedSeats?.map((s, i) => ({
      id: Number(s.seatId ?? i + 1),
      seatNumber: s.seatNumber,
    })) || [];

    const selectedSeats = seats.map((s) => s.id);

    const passengerForm = {
      name: passenger.name || "",
      email: passenger.email || "",
      phone: passenger.phone || "",
      age: passenger.age || "",
      gender: passenger.gender || "N/A",
    };

    downloadTicket({
      bookingId: t.bookingId,
      busData,
      selectedSeats,
      seats,
      passengerForm,
      paymentMethod: t.paymentMethod || "N/A",
      totalPrice: t.totalAmount,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-400 hover:text-orange-500 transition-colors mb-4 block"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My E-Tickets</h1>
              <p className="text-sm text-gray-400 mt-0.5">Download or print your travel tickets</p>
            </div>
            {!loading && tickets.length > 0 && (
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
                {tickets.length} ticket{tickets.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !tickets.length && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <p className="text-gray-400 text-sm mb-4">No tickets available yet.</p>
            <button
              onClick={() => navigate("/")}
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Book a trip →
            </button>
          </div>
        )}

        {/* Ticket cards */}
        {!loading && tickets.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden 
shadow-[0_15px_40px_rgba(0,0,0,0.25)] 
hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)] 
transition-all duration-300">
            {tickets.map((t) => (
              <div
                key={t.bookingId}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Orange top strip */}
                <div className="h-0.5 bg-gradient-to-r from-orange-400 to-red-400" />

                <div className="p-6">

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h2 className="text-lg font-bold text-gray-900">
                      {t.from} → {t.to}
                    </h2>
                    <span className="shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-5">{t.busName} · Ref: {t.bookingId}</p>

                  {/* Dashed divider — ticket feel */}
                  <div className="border-t border-dashed border-gray-200 mb-5" />

                  {/* Info grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-sm mb-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Travel Date</p>
                      <p className="font-semibold text-gray-800">{fmt(t.travelDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Departure</p>
                      <p className="font-semibold text-gray-800">{t.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Arrival</p>
                      <p className="font-semibold text-gray-800">{t.arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Seat(s)</p>
                      <p className="font-semibold text-gray-800">
                        {t.selectedSeats?.map((s) => s.seatNumber).join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Passenger</p>
                      <p className="font-semibold text-gray-800">{t.passengers?.[0]?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Total Fare</p>
                      <p className="font-bold text-orange-500">₹{t.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                      <p className="font-semibold text-gray-800">{t.passengers?.[0]?.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Email</p>
                      <p className="font-semibold text-gray-800 truncate">{t.passengers?.[0]?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                      <p className="font-semibold text-gray-800 capitalize">{t.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Dashed divider */}
                  <div className="border-t border-dashed border-gray-200 mb-4" />

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDownload(t)}
                      className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
                    >
                      Print / Download
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(t.bookingId);
                        alert(`Booking ID ${t.bookingId} copied!`);
                      }}
                      className="px-5 py-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-all duration-200"
                    >
                      Copy ID
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
