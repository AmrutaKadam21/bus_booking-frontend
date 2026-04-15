import axios from "axios";

const API = "http://localhost:5000/api/bus";

export const searchBuses = async (criteria) => {
  const res = await axios.get(`${API}/search-buses`, {
    params: {
      origin: criteria.origin,
      destination: criteria.destination,
      date: criteria.travelDate,
    },
  });

  // Handle both formats: {data: []} OR []
  const buses = res.data?.data || res.data || [];

  // Map backend → frontend format
  const mappedData = buses.map((bus) => ({
    _id: bus._id,

    operatorName: bus.busName,
    originCity: bus.from,
    destinationCity: bus.to,

    departureTime: bus.departureTime,
    arrivalTime: bus.arrivalTime,

    fare: bus.price,

    totalSeats: bus.seats,
    availableSeats:
      bus.availableSeats ??
      (bus.seats - (bus.bookedSeats?.length || 0)),

    busType: bus.busType || "Standard",

    amenities: bus.amenities || ["WiFi", "Water Bottle"],
    boardingPoints: bus.boardingPoints || ["Main Stop"],

    travelDurationMins: bus.travelDurationMins || 180,

    rating: bus.rating || 4.2,
    ratingsCount: bus.ratingsCount || 100,
  }));

  // ✅ IMPORTANT: return ONLY array
  return mappedData;
};