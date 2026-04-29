import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config/api";

// Module-level cache — fetched only once per page load
let _cache = null;

const FALLBACK = [
  "Mumbai", "Pune", "Nashik", "Nagpur", "Kolhapur",
  "Aurangabad", "Solapur", "Satara", "Ahmednagar",
  "Delhi", "Bangalore", "Hyderabad", "Chennai",
];

const useCities = () => {
  const [cities, setCities] = useState(_cache || FALLBACK);

  useEffect(() => {
    if (_cache) return;
    axios
      .get(`${API}/api/buses/cities`)
      .then((res) => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) {
          _cache = data;
          setCities(data);
        }
      })
      .catch(() => {}); // silently keep fallback
  }, []);

  return cities;
};

export default useCities;
