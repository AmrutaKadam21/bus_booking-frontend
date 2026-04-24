import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus, FaUser, FaCreditCard, FaMoneyBillWave, FaShieldAlt,
  FaCheckCircle, FaWheelchair, FaInfoCircle, FaDownload,
} from "react-icons/fa";
import { MdPayment, MdQrCodeScanner } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";

/* ── Berth cell matching the reference image ── */
const BerthSeat = ({ seat, price, onClick }) => {
  const isBooked   = seat.status === "booked";
  const isSelected = seat.status === "selected";

  return (
    <button
      onClick={() => !isBooked && onClick(seat)}
      disabled={isBooked}
      className={`flex flex-col items-center justify-between w-16 h-20 rounded-xl border-2 transition-all duration-150 ${
        isBooked   ? "bg-gray-100 border-gray-200 cursor-not-allowed" :
        isSelected ? "bg-white border-green-500 shadow-md" :
                     "bg-white border-green-400 hover:border-green-600 hover:shadow"
      }`}
    >
      {/* person icon area */}
      <div className="flex-1 flex items-center justify-center w-full">
        {isBooked ? (
          <FaPersonWalking className="text-gray-300 text-xl" />
        ) : isSelected ? (
          <div className="w-5 h-5 rounded-full bg-green-500" />
        ) : null}
      </div>
      {/* price / sold bar */}
      <div className={`w-full rounded-b-xl py-1 text-center ${
        isBooked ? "bg-gray-200" : isSelected ? "bg-green-500" : "bg-green-100"
      }`}>
        <span className={`text-xs font-semibold ${
          isBooked ? "text-gray-500" : isSelected ? "text-white" : "text-green-700"
        }`}>
          {isBooked ? "Sold" : `₹${price}`}
        </span>
      </div>
    </button>
  );
};

/* ── One deck column layout: 1 left | gap | 2 right, per row ──
   Matches image: window seat alone on left, two seats on right */
const DeckGrid = ({ deck, price, onSeatClick }) => {
  // group into rows of 3 (1 left + 2 right)
  const rows = [];
  for (let i = 0; i < deck.length; i += 3) rows.push(deck.slice(i, i + 3));

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center gap-2">
          {/* left seat (window) */}
          {row[0] && <BerthSeat seat={row[0]} price={price} onClick={onSeatClick} />}
          {/* aisle gap */}
          <div className="w-3" />
          {/* right two seats */}
          <div className="flex gap-2">
            {row[1] && <BerthSeat seat={row[1]} price={price} onClick={onSeatClick} />}
            {row[2] && <BerthSeat seat={row[2]} price={price} onClick={onSeatClick} />}
          </div>
        </div>
      ))}
    </div>
  );
};

const BookingSteps = ({
  bookingStep, setBookingStep,
  busData, seats, selectedSeats, seatsLoading,
  hasDecks, lowerDeck, upperDeck,
  passengerForm, handlePassengerChange,
  paymentMethod, setPaymentMethod,
  paymentDetails, handlePaymentDetailsChange, paymentErrors,
  loading, bookingComplete, bookingId,
  totalPrice,
  handleSeatClick, getSeatStatusColor, getSeatStatusText,
  proceedToPassengerDetails, proceedToPayment, handlePayment,
  downloadTicket,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* ── STEP 1: Seat Selection ── */}
      {bookingStep === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaBus className="text-[#d84e55]" /> Select Your Seats
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {busData.busName} • {busData.from} → {busData.to} • {busData.date}
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {[
              { border: "border-green-400 bg-white", label: "Available" },
              { border: "border-green-500 bg-green-500", label: "Selected" },
              { border: "border-gray-200 bg-gray-100", label: "Sold" },
            ].map(({ border, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-6 h-8 rounded-lg border-2 ${border}`}></div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* Seat Grid */}
          {seatsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#d84e55]"></div>
              <p className="ml-3 text-gray-500">Loading seat layout...</p>
            </div>
          ) : hasDecks ? (
            /* ── SLEEPER: Lower + Upper side by side ── */
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max mx-auto justify-center">

                {/* Lower Deck */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 text-base">Lower deck</h3>
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">🎯</span>
                    </div>
                  </div>
                  <DeckGrid deck={lowerDeck} price={busData.price} onSeatClick={handleSeatClick} />
                </div>

                {/* Upper Deck */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 text-base">Upper deck</h3>
                    <div className="w-8 h-8"></div>
                  </div>
                  <DeckGrid deck={upperDeck} price={busData.price} onSeatClick={handleSeatClick} />
                </div>

              </div>
            </div>
          ) : (
            /* ── SEATER: 2+2 grid ── */
            <div>
              <div className="mb-4 flex justify-center">
                <div className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-semibold">✇ DRIVER</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === "booked"}
                    className={`relative p-3 rounded-lg text-center font-semibold transition-all duration-200 ${getSeatStatusColor(seat)}`}
                  >
                    <div className="text-sm">{seat.seatNumber}</div>
                    <div className="text-xs mt-1 opacity-75">{getSeatStatusText(seat)}</div>
                    {seat.isHandicap && seat.status === "available" && <FaWheelchair className="absolute top-1 right-1 text-xs" />}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-center text-xs text-gray-400">← Window &nbsp; Aisle &nbsp; Aisle &nbsp; Window →</div>
            </div>
          )}

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Selected: <span className="font-bold text-[#d84e55]">{selectedSeats.length}</span> seats</p>
              <p className="text-sm text-gray-600">Total: <span className="font-bold">₹{totalPrice}</span></p>
            </div>
            <button
              onClick={proceedToPassengerDetails}
              disabled={selectedSeats.length === 0}
              className={`px-8 py-3 rounded-lg font-bold transition ${selectedSeats.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#d84e55] hover:bg-red-600 text-white shadow-lg"}`}
            >
              Continue to Passenger Details →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Passenger Details ── */}
      {bookingStep === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <FaUser className="text-[#d84e55]" /> Passenger Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={passengerForm.name} onChange={handlePassengerChange} placeholder="Enter passenger name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={passengerForm.email} onChange={handlePassengerChange} placeholder="Enter email address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={passengerForm.phone} onChange={handlePassengerChange} placeholder="Enter phone number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input type="number" name="age" value={passengerForm.age} onChange={handlePassengerChange} placeholder="Enter age" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select name="gender" value={passengerForm.gender} onChange={handlePassengerChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55]">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 flex items-center gap-2"><FaInfoCircle /> Handicap seats are available. Please ensure you meet the requirements.</p>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button onClick={() => setBookingStep(1)} className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition">← Back</button>
            <button onClick={proceedToPayment} className="flex-1 bg-[#d84e55] hover:bg-red-600 text-white py-3 rounded-lg font-bold transition shadow-lg">Proceed to Payment →</button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Payment ── */}
      {bookingStep === 3 && !bookingComplete && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <MdPayment className="text-[#d84e55]" /> Payment Method
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d84e55] mx-auto"></div>
              <p className="mt-4 text-gray-600">Processing payment...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "card", label: "Credit/Debit Card", icon: <FaCreditCard /> },
                    { id: "upi", label: "UPI", icon: <FaMoneyBillWave /> },
                    { id: "netbanking", label: "Net Banking", icon: <FaShieldAlt /> },
                  ].map((method) => (
                    <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-lg text-center transition ${paymentMethod === method.id ? "border-[#d84e55] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="text-sm font-semibold">{method.label}</div>
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <input type="text" name="cardNumber" placeholder="Card Number" value={paymentDetails.cardNumber} onChange={handlePaymentDetailsChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] ${paymentErrors.cardNumber ? "border-red-500" : "border-gray-300"}`} />
                      {paymentErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{paymentErrors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input type="text" name="expiryDate" placeholder="MM/YY" value={paymentDetails.expiryDate} onChange={handlePaymentDetailsChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] ${paymentErrors.expiryDate ? "border-red-500" : "border-gray-300"}`} />
                        {paymentErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{paymentErrors.expiryDate}</p>}
                      </div>
                      <div>
                        <input type="password" name="cvv" placeholder="CVV" maxLength="4" value={paymentDetails.cvv} onChange={handlePaymentDetailsChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] ${paymentErrors.cvv ? "border-red-500" : "border-gray-300"}`} />
                        {paymentErrors.cvv && <p className="text-red-500 text-xs mt-1">{paymentErrors.cvv}</p>}
                      </div>
                    </div>
                    <div>
                      <input type="text" name="cardholderName" placeholder="Cardholder Name" value={paymentDetails.cardholderName} onChange={handlePaymentDetailsChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] ${paymentErrors.cardholderName ? "border-red-500" : "border-gray-300"}`} />
                      {paymentErrors.cardholderName && <p className="text-red-500 text-xs mt-1">{paymentErrors.cardholderName}</p>}
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="mt-4">
                    <input type="text" name="upiId" placeholder="Enter UPI ID (example@bank)" value={paymentDetails.upiId} onChange={handlePaymentDetailsChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] ${paymentErrors.upiId ? "border-red-500" : "border-gray-300"}`} />
                    {paymentErrors.upiId && <p className="text-red-500 text-xs mt-1">{paymentErrors.upiId}</p>}
                    <div className="mt-3 flex justify-center"><MdQrCodeScanner className="text-6xl text-gray-400" /></div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="mt-4">
                    <select name="bankName" value={paymentDetails.bankName} onChange={handlePaymentDetailsChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] ${paymentErrors.bankName ? "border-red-500" : "border-gray-300"}`}>
                      <option value="">Select Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                    </select>
                    {paymentErrors.bankName && <p className="text-red-500 text-xs mt-1">{paymentErrors.bankName}</p>}
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-4">
                <button onClick={() => setBookingStep(2)} className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition">← Back</button>
                <button onClick={handlePayment} className="flex-1 bg-[#d84e55] hover:bg-red-600 text-white py-3 rounded-lg font-bold transition shadow-lg">Pay ₹{totalPrice} →</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 4: Confirmation ── */}
      {bookingStep === 4 && bookingComplete && (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-4">Your bus tickets have been booked successfully</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-2">Booking ID: <span className="font-bold text-gray-800">{bookingId}</span></p>
            <div className="border-t border-gray-200 my-3"></div>
            <div className="space-y-2">
              <p className="text-sm"><strong>Bus:</strong> {busData.busName}</p>
              <p className="text-sm"><strong>Bus Number:</strong> {busData.busNumber || "N/A"}</p>
              <p className="text-sm"><strong>Route:</strong> {busData.from} → {busData.to}</p>
              <p className="text-sm"><strong>Date:</strong> {busData.date}</p>
              <p className="text-sm"><strong>Departure:</strong> {busData.departureTime}</p>
              <p className="text-sm"><strong>Arrival:</strong> {busData.arrivalTime}</p>
              <p className="text-sm"><strong>Seats:</strong> {selectedSeats.map(s => s.seatNumber + (s.deckType && s.deckType !== 'single' ? ` (${s.deckType})` : '')).join(", ")}</p>
              <p className="text-sm"><strong>Passenger:</strong> {passengerForm.name}</p>
              <p className="text-sm"><strong>Email:</strong> {passengerForm.email}</p>
              <p className="text-sm"><strong>Phone:</strong> {passengerForm.phone}</p>
              <p className="text-sm"><strong>Total Paid:</strong> ₹{totalPrice}</p>
              <p className="text-sm"><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => navigate("/")} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition">Home</button>
            <button onClick={downloadTicket} className="flex-1 bg-[#d84e55] hover:bg-red-600 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2">
              <FaDownload /> Download Ticket
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingSteps;
