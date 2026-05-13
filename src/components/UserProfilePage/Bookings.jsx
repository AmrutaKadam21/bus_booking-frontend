import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../config/api";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const Skeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-4">
    <div className="flex justify-between">
      <div className="h-5 w-48 bg-gray-100 rounded" />
      <div className="h-5 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
    </div>
  </div>
);

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/api/bookings/user/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBookings(res.data.data.filter((b) => b.bookingStatus === "confirmed")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await axios.put(`${API}/api/bookings/cancel/${cancelId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setBookings((prev) => prev.filter((b) => b.bookingId !== cancelId));
      setCancelId(null);
    } catch {
      alert("Failed to cancel. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
         
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-sm text-gray-400 mt-0.5">Your confirmed upcoming trips</p>
            </div>
            {!loading && bookings.length > 0 && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                {bookings.length} confirmed
              </span>
            )}
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !bookings.length && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <p className="text-gray-400 text-sm mb-4">No confirmed bookings found.</p>
            <button
              onClick={() => navigate("/")}
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Search buses →
            </button>
          </div>
        )}

        {/* Booking cards */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.bookingId}
                className="bg-white rounded-2xl border border-gray-300 overflow-hidden 
shadow-[0_15px_40px_rgba(0,0,0,0.25)] 
hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)] 
transition-all duration-300"              >
                {/* Orange top strip */}
                <div className="h-0.5 bg-gradient-to-r from-orange-400 to-red-400" />

                <div className="p-6">
                  {/* Top row — route + status */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {b.from} → {b.to}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">{b.busName}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
                      <p className="font-semibold text-gray-800">{b.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Travel Date</p>
                      <p className="font-semibold text-gray-800">{fmt(b.travelDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Departure</p>
                      <p className="font-semibold text-gray-800">{b.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Arrival</p>
                      <p className="font-semibold text-gray-800">{b.arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Seats</p>
                      <p className="font-semibold text-gray-800">
                        {b.selectedSeats?.map((s) => s.seatNumber).join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Total Fare</p>
                      <p className="font-bold text-orange-500">₹{b.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Passenger</p>
                      <p className="font-semibold text-gray-800">{b.passengers?.[0]?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                      <p className="font-semibold text-gray-800">{b.passengers?.[0]?.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                      <p className="font-semibold text-gray-800 capitalize">{b.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Divider + action */}
                  <div className="border-t border-gray-100 pt-4 flex justify-end">
                    <button
                      onClick={() => setCancelId(b.bookingId)}
                      className="text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel this booking?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Refund of the paid amount will be processed within 3–5 business days.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Cancelling</>
                ) : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )} 
      <div className="mb-8 ml-70 mt-10">
      <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-400 hover:text-orange-500 transition-colors mb-4 block"
          >
            ← Back to Dashboard
          </button>
    </div>
    </div>
  );
}
