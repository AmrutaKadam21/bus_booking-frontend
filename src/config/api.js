// Single source of truth for backend URL
// Reads VITE_API_BASE_URL from .env, falls back to deployed Render URL
const API = import.meta.env.VITE_API_BASE_URL || "https://bus-booking-backend-rk6y.onrender.com";

export default API;
