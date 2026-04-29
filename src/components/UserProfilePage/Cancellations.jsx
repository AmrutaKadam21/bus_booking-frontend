import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../config/api";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const Skeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
    <div className="flex justify-between">
      <div className="h-5 w-48 bg-gray-100 rounded" />
      <div className="h-5 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="grid grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
    </div>
  </div>
);

export default function Cancellations() {
  const navigate = useNavigate();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API}/api/bookings/user/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data.data.filter((b) => b.bookingStatus === "cancelled")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
         
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cancelled Bookings</h1>
              <p className="text-sm text-gray-400 mt-0.5">Your cancelled trips and refund status</p>
            </div>
            {!loading && data.length > 0 && (
              <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
                {data.length} cancelled
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !data.length && (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <p className="text-gray-400 text-sm mb-4">No cancelled bookings found.</p>
            <button
              onClick={() => navigate("/bookings")}
              className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              View active bookings →
            </button>
          </div>
        )}

        {/* Cards */}
        {!loading && data.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 
shadow-[0_15px_40px_rgba(0,0,0,0.25)] 
hover:shadow-[0_25px_60px_rgba(0,0,0,0.35)] 
transition-all duration-300">
            {data.map((b) => (
              <div
                key={b.bookingId}
                className="bg-white rounded-2xl border border-gray-100  duration-300"
              >
                {/* Red top strip */}
                <div className="h-0.5 bg-gradient-to-r from-red-400 to-rose-300" />

                <div className="p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-500 line-through">
                        {b.from} → {b.to}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">{b.busName}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                      Cancelled
                    </span>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
                      <p className="font-semibold text-gray-500">{b.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Travel Date</p>
                      <p className="font-semibold text-gray-500">{fmt(b.travelDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Departure</p>
                      <p className="font-semibold text-gray-500">{b.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Seats</p>
                      <p className="font-semibold text-gray-500">
                        {b.selectedSeats?.map((s) => s.seatNumber).join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Passenger</p>
                      <p className="font-semibold text-gray-500">{b.passengers?.[0]?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Amount Paid</p>
                      <p className="font-bold text-gray-500">₹{b.totalAmount}</p>
                    </div>
                  </div>

                  {/* Refund notice */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Refund Status</p>
                        <p className="text-sm font-semibold text-amber-600">
                          Refund in progress — credited within 3–5 business days
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full shrink-0 ml-4">
                        Processing
                      </span>
                    </div>
                  </div>
                </div> 
           
              </div>


            ))}
            
          </div>
              
        )}
              <div className="mb-8 ml-8 mt-10">

         <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-gray-400 hover:text-orange-500 transition-colors mb-4 block"
          >
            ← Back to Dashboard
          </button>
          </div>
      </div>
    </div>
  );
}
