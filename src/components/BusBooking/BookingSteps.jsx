import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBus, FaUser, FaCreditCard, FaMoneyBillWave, FaShieldAlt,
  FaCheckCircle, FaDownload, FaInfoCircle,
} from "react-icons/fa";
import { MdPayment, MdQrCodeScanner } from "react-icons/md";
import { getSeatStatusWithGender } from "../../utils/genderSeatUtils";


/* ── Enhanced Berth cell with gender compatibility ── */
const BerthSeat = ({ seat, price, onClick, userGender, allSeats, busType, onBlocked }) => {
  const s = getSeatStatusWithGender(seat, userGender, allSeats, busType);
  const isBooked = s.status === "booked";
  const isSelected = s.status === "selected";
  const gender = seat.bookedByGender;

  const handleClick = () => {
    if (isBooked) return;
    if (!s.canBook) { onBlocked && onBlocked(s.message); return; }
    onClick(seat);
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleClick}
        className={`flex flex-col items-center justify-between w-16 h-20 rounded-xl border-2 transition-all duration-150 overflow-hidden ${
          isBooked   ? "bg-gray-100 border-gray-300 cursor-not-allowed" :
          s.blocked  ? "bg-red-50 border-red-300 cursor-not-allowed" :
          isSelected ? "bg-white border-green-500 shadow-md" :
                       "bg-white border-green-400 hover:border-green-600 hover:shadow"
        }`}
      >
        <div className="flex-1 flex flex-col items-center justify-center w-full gap-0.5">
          {isSelected && <div className="w-3 h-3 rounded-full bg-green-500" />}
          {s.blocked && <span className="text-red-400 text-sm">🚫</span>}
          <span className={`text-xs font-bold ${
            isBooked ? "text-gray-500" : s.blocked ? "text-red-400" : isSelected ? "text-green-700" : "text-gray-700"
          }`}>{seat.seatNumber}</span>
        </div>
        {/* Bottom bar — pink for female, blue for male, red for blocked */}
        <div className={`w-full py-1 text-center ${
          isBooked   ? (gender === "female" ? "bg-pink-500" : gender === "male" ? "bg-blue-500" : "bg-gray-300") :
          s.blocked  ? "bg-red-300" :
          isSelected ? "bg-green-500" : "bg-green-100"
        }`}>
          {isBooked ? (
            <span className="text-base leading-none">
              {gender === "female" ? "👩" : gender === "male" ? "👨" : "👤"}
            </span>
          ) : (
            <span className={`text-xs font-semibold ${
              s.blocked ? "text-white" : isSelected ? "text-white" : "text-green-700"
            }`}>{s.blocked ? "N/A" : `₹${price}`}</span>
          )}
        </div>
      </button>
    </div>
  );
};

/* ── Seater cell (normal bus) ── */
const SeaterSeat = ({ seat, price, onClick }) => {
  const isBooked   = seat.status === "booked";
  const isSelected = seat.status === "selected";
  const gender = seat.bookedByGender;
  return (
    <button
      onClick={() => !isBooked && onClick(seat)}
      disabled={isBooked}
      className={`flex flex-col items-center justify-between w-16 h-16 rounded-xl border-2 transition-all duration-150 overflow-hidden ${
        isBooked   ? "bg-gray-100 border-gray-300 cursor-not-allowed" :
        isSelected ? "bg-white border-green-500 shadow-md" :
                     "bg-white border-green-400 hover:border-green-600 hover:shadow"
      }`}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full gap-0.5">
        {isSelected && <div className="w-3 h-3 rounded-full bg-green-500" />}
        <span className={`text-xs font-bold ${isBooked ? "text-gray-500" : isSelected ? "text-green-700" : "text-gray-700"}`}>
          {seat.seatNumber}
        </span>
      </div>
      <div className={`w-full py-1 text-center ${
        isBooked ? (gender === "female" ? "bg-pink-400" : gender === "male" ? "bg-blue-400" : "bg-gray-300") :
        isSelected ? "bg-green-500" : "bg-green-100"
      }`}>
        {isBooked ? (
          <span className="text-sm leading-none">
            {gender === "female" ? "👩" : gender === "male" ? "👨" : "🚪"}
          </span>
        ) : (
          <span className={`text-[10px] font-semibold ${isSelected ? "text-white" : "text-green-700"}`}>
            {`₹${price}`}
          </span>
        )}
      </div>
    </button>
  );
};

/* ── One deck column layout with gender compatibility ── */
const DeckGrid = ({ deck, price, onSeatClick, userGender, allSeats, busType, onBlocked }) => {
  const rows = [];
  for (let i = 0; i < deck.length; i += 3) rows.push(deck.slice(i, i + 3));

  return (
    <div className="flex flex-col gap-8">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-start gap-2">
          {row[0] && <BerthSeat seat={row[0]} price={price} onClick={onSeatClick} userGender={userGender} allSeats={allSeats} busType={busType} onBlocked={onBlocked} />}
          <div className="w-3" />
          <div className="flex gap-2">
            {row[1] && <BerthSeat seat={row[1]} price={price} onClick={onSeatClick} userGender={userGender} allSeats={allSeats} busType={busType} onBlocked={onBlocked} />}
            {row[2] && <BerthSeat seat={row[2]} price={price} onClick={onSeatClick} userGender={userGender} allSeats={allSeats} busType={busType} onBlocked={onBlocked} />}
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
  handleSeatClick,
  proceedToPassengerDetails, proceedToPayment, handlePayment,
  downloadTicket,
  selectedBoardingPoint, setSelectedBoardingPoint,
  selectedDroppingPoint, setSelectedDroppingPoint,
}) => {
  const navigate = useNavigate();
  const [genderBlockMsg, setGenderBlockMsg] = React.useState("");

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

          {/* Gender Selection for Sleeper Buses */}
          {hasDecks && (
            <div className={`mb-6 p-4 rounded-lg border ${
              !passengerForm.gender ? "bg-yellow-50 border-yellow-300" : "bg-blue-50 border-blue-200"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <FaInfoCircle className={!passengerForm.gender ? "text-yellow-500" : "text-blue-500"} />
                <h4 className={`font-semibold ${ !passengerForm.gender ? "text-yellow-800" : "text-blue-800"}`}>
                  {!passengerForm.gender ? "⚠️ Select Your Gender to Continue" : "Gender Selected"}
                </h4>
              </div>
              <p className={`text-sm mb-3 ${!passengerForm.gender ? "text-yellow-700" : "text-blue-700"}`}>
                For sleeper buses, we ensure gender-appropriate seating. Select your gender to see available seats.
              </p>
              <div className="flex gap-3">
                {[{ val: "male", icon: "👨" }, { val: "female", icon: "👩" }, { val: "other", icon: "🧑" }].map(({ val, icon }) => (
                  <button
                    key={val}
                    onClick={() => handlePassengerChange({ target: { name: "gender", value: val } })}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition flex items-center gap-2 ${
                      passengerForm.gender === val
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-blue-600 border-blue-300 hover:border-blue-500"
                    }`}
                  >
                    <span>{icon}</span>{val.charAt(0).toUpperCase() + val.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {[
              { border: "border-green-400 bg-white", label: "Available" },
              { border: "border-green-500 bg-green-500", label: "Selected" },
              { border: "border-gray-200 bg-gray-100", label: "Sold" },
              { border: "border-red-200 bg-red-50", label: "Not Suitable" },
            ].map(({ border, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-6 h-8 rounded-lg border-2 ${border}`}></div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
            {hasDecks && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-lg">👩</span>
                <span className="text-sm">Female</span>
                <span className="text-lg ml-2">👨</span>
                <span className="text-sm">Male</span>
              </div>
            )}
          </div>

          {/* Seat Grid — blocked until gender selected for sleeper */}
          {hasDecks && !passengerForm.gender ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl mb-4">🚌</span>
              <p className="text-gray-500 font-semibold">Please select your gender above to view available seats</p>
            </div>
          ) : seatsLoading ? (
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
                      <span className="text-gray-500 text-xs"></span>
                    </div>
                  </div>
                  <DeckGrid 
                    deck={lowerDeck} 
                    price={busData.price} 
                    onSeatClick={handleSeatClick}
                    userGender={passengerForm.gender}
                    allSeats={seats}
                    busType={busData.busType}
                    onBlocked={setGenderBlockMsg}
                  />
                </div>

                {/* Upper Deck */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 text-base">Upper deck</h3>
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <span className="text-gray-500 text-xs"></span>
                    </div>
                  </div>
                  <DeckGrid 
                    deck={upperDeck} 
                    price={busData.price} 
                    onSeatClick={handleSeatClick}
                    userGender={passengerForm.gender}
                    allSeats={seats}
                    busType={busData.busType}
                    onBlocked={setGenderBlockMsg}
                  />
                </div>

              </div>
            </div>
          ) : (
            /* ── SEATER: same card style, 2 | gap | 2 per row ── */
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700 text-base">Seat Layout</h3>
                <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs">🎯</div>
              </div>
              <div className="flex flex-col gap-3">
                {Array.from({ length: Math.ceil(seats.length / 4) }, (_, ri) => {
                  const row = seats.slice(ri * 4, ri * 4 + 4);
                  return (
                    <div key={ri} className="flex items-center gap-2">
                      {/* left 2 seats */}
                      <div className="flex gap-2">
                        {row[0] && <SeaterSeat seat={row[0]} price={busData.price} onClick={handleSeatClick} />}
                        {row[1] && <SeaterSeat seat={row[1]} price={busData.price} onClick={handleSeatClick} />}
                      </div>
                      {/* aisle gap */}
                      <div className="w-4" />
                      {/* right 2 seats */}
                      <div className="flex gap-2">
                        {row[2] && <SeaterSeat seat={row[2]} price={busData.price} onClick={handleSeatClick} />}
                        {row[3] && <SeaterSeat seat={row[3]} price={busData.price} onClick={handleSeatClick} />}
                      </div>
                    </div>
                  );
                })}
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
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Boarding and Dropping Points */}
            {(busData.boardingPoints?.length > 0 || busData.droppingPoints?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {busData.boardingPoints?.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Boarding Point <span className="text-red-500">*</span></label>
                    <select
                      value={selectedBoardingPoint?.name || ""}
                      onChange={(e) => {
                        const point = busData.boardingPoints.find(p => p.name === e.target.value);
                        setSelectedBoardingPoint(point);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55]"
                    >
                      <option value="">Select boarding point</option>
                      {busData.boardingPoints.map((point, idx) => (
                        <option key={idx} value={point.name || point}>
                          {typeof point === 'string' ? point : `${point.name} - ${point.time}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {busData.droppingPoints?.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dropping Point <span className="text-red-500">*</span></label>
                    <select
                      value={selectedDroppingPoint?.name || ""}
                      onChange={(e) => {
                        const point = busData.droppingPoints.find(p => p.name === e.target.value);
                        setSelectedDroppingPoint(point);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55]"
                    >
                      <option value="">Select dropping point</option>
                      {busData.droppingPoints.map((point, idx) => (
                        <option key={idx} value={point.name || point}>
                          {typeof point === 'string' ? point : `${point.name} - ${point.time}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

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

      {/* ── Gender block popup ── */}
      {genderBlockMsg && (
        <div style={{position:"fixed",inset:0,zIndex:99999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(3px)"}}>
          <div style={{background:"#fff",borderRadius:"1.25rem",padding:"2rem",maxWidth:"360px",width:"90%",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",textAlign:"center"}}>
            <div style={{width:"64px",height:"64px",borderRadius:"50%",background:"#fee2e2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem",fontSize:"2rem"}}>
              🚫
            </div>
            <h3 style={{fontSize:"1.1rem",fontWeight:700,color:"#1f2937",marginBottom:"0.5rem"}}>Seat Not Available</h3>
            <p style={{fontSize:"0.875rem",color:"#6b7280",marginBottom:"1.5rem",lineHeight:1.6}}>{genderBlockMsg}</p>
            <button onClick={() => setGenderBlockMsg("")} style={{background:"#d84e55",color:"#fff",border:"none",borderRadius:"0.75rem",padding:"0.65rem 2rem",fontWeight:700,fontSize:"0.95rem",cursor:"pointer",width:"100%"}}>
              OK, Got it
            </button>
          </div>
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
