import React from "react";
import { FaBus, FaUser, FaShieldAlt, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaTicketAlt } from "react-icons/fa";

const BookingSummary = ({ busData, selectedSeats, passengerForm, totalPrice }) => {
  // selectedSeats is array of { id, seatNumber, deckType, seatType }
  const hasDecks = selectedSeats.some(s => s.deckType && s.deckType !== "single");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
        <FaTicketAlt className="text-[#d84e55]" /> Booking Summary
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-500 flex items-center gap-2"><FaBus className="text-[#d84e55]" /> Bus</span>
          <span className="font-semibold text-right">{busData.busName}</span>
        </div>
        {busData.busType && (
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-500">Type</span>
            <span className="font-semibold text-right">{busData.busType}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-500 flex items-center gap-2"><FaMapMarkerAlt className="text-[#d84e55]" /> Route</span>
          <span className="font-semibold text-right">{busData.from} → {busData.to}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-500 flex items-center gap-2"><FaCalendarAlt className="text-[#d84e55]" /> Date</span>
          <span className="font-semibold text-right">{busData.date}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-gray-500 flex items-center gap-2"><FaClock className="text-[#d84e55]" /> Time</span>
          <span className="font-semibold text-right">{busData.departureTime}</span>
        </div>

        <div className="border-t border-gray-200 my-3"></div>

        {/* Selected seats with deck info */}
        <div className="py-2">
          <span className="text-gray-500 block mb-2">Selected Seats</span>
          {selectedSeats.length === 0 ? (
            <span className="text-gray-400 text-xs">None selected</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map(s => (
                <span key={s.id} className="bg-[#d84e55] text-white text-xs px-2 py-1 rounded-lg font-semibold">
                  {s.seatNumber}{hasDecks ? ` (${s.deckType})` : ""}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Seat Count</span>
          <span className="font-semibold">{selectedSeats.length}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500">Price per Seat</span>
          <span className="font-semibold">₹{busData.price}</span>
        </div>

        <div className="border-t border-gray-200 my-3"></div>

        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500 flex items-center gap-2"><FaUser className="text-[#d84e55]" /> Passenger</span>
          <span className="font-semibold text-right">{passengerForm.name || "Not added"}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500 flex items-center gap-2"><FaPhone className="text-[#d84e55]" /> Contact</span>
          <span className="font-semibold text-right">{passengerForm.phone || "Not added"}</span>
        </div>

        <div className="border-t border-gray-200 my-3"></div>

        <div className="flex justify-between items-center py-2 text-lg font-bold">
          <span>Total Amount</span>
          <span className="text-[#d84e55]">₹{totalPrice}</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800 flex items-center gap-1">
          <FaShieldAlt /> Secure booking with 100% refund guarantee
        </p>
      </div>
    </div>
  );
};

export default BookingSummary;
