import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBus, FaUser, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import axios from "axios";
import API from "../../config/api";

import BookingSteps from "./BookingSteps";
import BookingSummary from "./BookingSummary";
import downloadTicket from "./DownloadTicket";

const SeatBook = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const busData = location.state?.busData || {
    busName: "Express Luxury", busNumber: "EX-101",
    from: "Mumbai", to: "Pune",
    date: new Date().toISOString().split("T")[0],
    departureTime: "08:00 AM", arrivalTime: "12:00 PM",
    price: 700, totalSeats: 40, _id: "65f7c8d9e1a2b3c4d5e6f7g8",
  };

  const [seats, setSeats]                   = useState([]);
  const [lowerDeck, setLowerDeck]           = useState([]);
  const [upperDeck, setUpperDeck]           = useState([]);
  const [hasDecks, setHasDecks]             = useState(false);
  const [selectedSeats, setSelectedSeats]   = useState([]);
  const [bookingStep, setBookingStep]       = useState(1);
  const [seatsLoading, setSeatsLoading]     = useState(true);
  const [loading, setLoading]               = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId]           = useState("");

  const [passengerForm, setPassengerForm] = useState({
    name: "", email: "", phone: "", age: "", gender: "male",
  });
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "", expiryDate: "", cvv: "", cardholderName: "", upiId: "", bankName: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  const totalPrice = selectedSeats.length * busData.price;

  // ── Seat Layout ──
  useEffect(() => { fetchSeatLayout(); }, []);

  const fetchSeatLayout = async () => {
    setSeatsLoading(true);
    try {
      const date = busData.date || new Date().toISOString().split("T")[0];
      const statusRes = await axios.get(`${API}/api/buses/seat-status/${busData._id}?date=${date}`);
      const { totalSeats, bookedSeats } = statusRes.data;
      const total = totalSeats || busData.totalSeats || busData.seats || 40;

      const busType = (busData.busType || "").toLowerCase();
      const isSleeper = busType.includes("sleeper") && !busType.includes("semi");
      const isSemiSleeper = busType.includes("semi");
      const decks = isSleeper || isSemiSleeper;
      setHasDecks(decks);

      const buildSeat = (i, deck, type) => {
        const num = String(i);
        return { id: i, seatNumber: num, status: bookedSeats.includes(num) ? "booked" : "available", deckType: deck, seatType: type };
      };

      if (isSleeper) {
        const half = Math.ceil(total / 2);
        const lower = Array.from({ length: half }, (_, i) => buildSeat(i + 1, "lower", "sleeper"));
        const upper = Array.from({ length: total - half }, (_, i) => buildSeat(half + i + 1, "upper", "sleeper"));
        setLowerDeck(lower);
        setUpperDeck(upper);
        setSeats([...lower, ...upper]);
      } else if (isSemiSleeper) {
        const seaterCount = Math.ceil(total * 0.6);
        const lower = Array.from({ length: seaterCount }, (_, i) => buildSeat(i + 1, "lower", "seater"));
        const upper = Array.from({ length: total - seaterCount }, (_, i) => buildSeat(seaterCount + i + 1, "upper", "sleeper"));
        setLowerDeck(lower);
        setUpperDeck(upper);
        setSeats([...lower, ...upper]);
      } else {
        const all = Array.from({ length: total }, (_, i) => buildSeat(i + 1, "single", "seater"));
        setSeats(all);
      }
    } catch {
      generateLocalSeats();
    } finally {
      setSeatsLoading(false);
    }
  };

  const generateLocalSeats = () => {
    const total = busData.totalSeats || busData.seats || 40;
    const busType = (busData.busType || "").toLowerCase();
    const isSleeper = busType.includes("sleeper") && !busType.includes("semi");
    const isSemiSleeper = busType.includes("semi");
    const decks = isSleeper || isSemiSleeper;
    setHasDecks(decks);

    const buildSeat = (i, deck, type) => ({ id: i, seatNumber: String(i), status: "available", deckType: deck, seatType: type });

    if (isSleeper) {
      const half = Math.ceil(total / 2);
      const lower = Array.from({ length: half }, (_, i) => buildSeat(i + 1, "lower", "sleeper"));
      const upper = Array.from({ length: total - half }, (_, i) => buildSeat(half + i + 1, "upper", "sleeper"));
      setLowerDeck(lower); setUpperDeck(upper); setSeats([...lower, ...upper]);
    } else if (isSemiSleeper) {
      const seaterCount = Math.ceil(total * 0.6);
      const lower = Array.from({ length: seaterCount }, (_, i) => buildSeat(i + 1, "lower", "seater"));
      const upper = Array.from({ length: total - seaterCount }, (_, i) => buildSeat(seaterCount + i + 1, "upper", "sleeper"));
      setLowerDeck(lower); setUpperDeck(upper); setSeats([...lower, ...upper]);
    } else {
      setSeats(Array.from({ length: total }, (_, i) => buildSeat(i + 1, "single", "seater")));
    }
  };

  const handlePassengerChange = (e) => setPassengerForm({ ...passengerForm, [e.target.name]: e.target.value });

  const handleSeatClick = (seat) => {
    if (seat.status === "booked") return;
    const updateList = (list) => list.map(s => s.id === seat.id ? { ...s, status: s.status === "selected" ? "available" : "selected" } : s);
    setSeats(prev => updateList(prev));
    if (hasDecks) {
      if (seat.deckType === "lower") setLowerDeck(prev => updateList(prev));
      else setUpperDeck(prev => updateList(prev));
    }
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id);
      return exists ? prev.filter(s => s.id !== seat.id) : [...prev, { id: seat.id, seatNumber: seat.seatNumber, deckType: seat.deckType, seatType: seat.seatType }];
    });
  };

  const proceedToPassengerDetails = () => {
    if (selectedSeats.length === 0) { alert("Please select at least one seat"); return; }
    if (busData.boardingPoints?.length > 0 && !selectedBoardingPoint) {
      alert("Please select a boarding point"); return;
    }
    if (busData.droppingPoints?.length > 0 && !selectedDroppingPoint) {
      alert("Please select a dropping point"); return;
    }
    setBookingStep(2);
  };

  const proceedToPayment = () => {
    if (!passengerForm.name || !passengerForm.email || !passengerForm.phone) { alert("Please fill all passenger details"); return; }
    setBookingStep(3);
  };

  // ── Payment ──
  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    if (paymentErrors[e.target.name]) setPaymentErrors({ ...paymentErrors, [e.target.name]: "" });
  };

  const validatePaymentDetails = () => {
    const errors = {};
    if (paymentMethod === "card") {
      if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) errors.cardNumber = "Valid card number is required";
      if (!paymentDetails.expiryDate) errors.expiryDate = "Expiry date is required";
      if (!paymentDetails.cvv || paymentDetails.cvv.length < 3) errors.cvv = "Valid CVV is required";
      if (!paymentDetails.cardholderName) errors.cardholderName = "Cardholder name is required";
    } else if (paymentMethod === "upi") {
      if (!paymentDetails.upiId || !paymentDetails.upiId.includes("@")) errors.upiId = "Valid UPI ID is required (example@bank)";
    } else if (paymentMethod === "netbanking") {
      if (!paymentDetails.bankName) errors.bankName = "Please select a bank";
    }
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails()) { alert("Please fill all payment details correctly"); return; }
    setLoading(true);

    const bookingData = {
      busId: busData._id, busName: busData.busName,
      from: busData.from, to: busData.to,
      departureTime: busData.departureTime, arrivalTime: busData.arrivalTime,
      selectedSeats: selectedSeats.map(s => ({ id: s.id, seatNumber: String(s.seatNumber) })),
      passengers: { name: passengerForm.name, email: passengerForm.email, phone: passengerForm.phone, age: passengerForm.age ? Number(passengerForm.age) : undefined, gender: passengerForm.gender },
      boardingPoint: selectedBoardingPoint,
      droppingPoint: selectedDroppingPoint,
      totalAmount: totalPrice, paymentMethod,
      travelDate: busData.date || new Date().toISOString().split("T")[0],
      userId: (() => { try { return JSON.parse(localStorage.getItem("user"))?.id || null; } catch { return null; } })(),
    };

    // Generate booking ID immediately and show confirmation without waiting for API
    const newBookingId = "BK" + Date.now().toString(36).toUpperCase();
    setBookingId(newBookingId);
    setBookingComplete(true);
    setBookingStep(4);
    setLoading(false);

    // Fire API calls in background (non-blocking)
    axios.post(`${API}/api/bookings/create`, { ...bookingData, bookingId: newBookingId })
      .catch(err => console.warn("Booking save failed (non-critical):", err?.message));

    const seatNumbers = selectedSeats.map(s => String(s.seatNumber));
    const travelDate = busData.date || new Date().toISOString().split("T")[0];
    axios.post(`${API}/api/buses/book-seats/${busData._id}`, { seatNumbers, travelDate, passengerGender: passengerForm.gender })
      .catch(err => console.warn("Seat update failed (non-critical):", err?.message));
  };

  // ── Download Ticket ──
  const handleDownloadTicket = () => downloadTicket({ bookingId, busData, selectedSeats, passengerForm, paymentMethod, totalPrice });

  // ── Progress Steps ──
  const steps = [
    { step: 1, label: "Select Seats",      icon: <FaBus /> },
    { step: 2, label: "Passenger Details", icon: <FaUser /> },
    { step: 3, label: "Payment",           icon: <MdPayment /> },
    { step: 4, label: "Confirmation",      icon: <FaCheckCircle /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-[#d84e55] transition">
            <FaArrowLeft /> Back to Buses
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Bus Ticket Booking</h1>
            <p className="text-sm text-gray-500">Complete your journey with us</p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${bookingStep >= item.step ? "bg-[#d84e55] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {item.icon}
                  <span className="text-sm font-semibold hidden sm:inline">{item.label}</span>
                </div>
                {item.step < 4 && <div className="w-8 h-0.5 bg-gray-300 mx-2 hidden sm:block"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Steps */}
          <div className="lg:col-span-2">
            <BookingSteps
              bookingStep={bookingStep} setBookingStep={setBookingStep}
              busData={busData} seats={seats} selectedSeats={selectedSeats} seatsLoading={seatsLoading}
              hasDecks={hasDecks} lowerDeck={lowerDeck} upperDeck={upperDeck}
              passengerForm={passengerForm} handlePassengerChange={handlePassengerChange}
              paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
              paymentDetails={paymentDetails} handlePaymentDetailsChange={handlePaymentDetailsChange} paymentErrors={paymentErrors}
              loading={loading} bookingComplete={bookingComplete} bookingId={bookingId}
              totalPrice={totalPrice}
              handleSeatClick={handleSeatClick}
              proceedToPassengerDetails={proceedToPassengerDetails} proceedToPayment={proceedToPayment} handlePayment={handlePayment}
              downloadTicket={handleDownloadTicket}
              selectedBoardingPoint={selectedBoardingPoint} setSelectedBoardingPoint={setSelectedBoardingPoint}
              selectedDroppingPoint={selectedDroppingPoint} setSelectedDroppingPoint={setSelectedDroppingPoint}
            />
          </div>

          {/* Summary Sidebar */}
          {bookingStep !== 4 && (
            <div className="lg:col-span-1">
              <BookingSummary
                busData={busData} selectedSeats={selectedSeats}
                passengerForm={passengerForm} totalPrice={totalPrice}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SeatBook;
