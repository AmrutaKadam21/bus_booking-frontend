import React, { useEffect, useState } from "react";
import { searchBuses } from "../services/busService";
import BusResultCard from "../components/BusBooking/BusResultCard";
import { useSearchContext } from "../context/SearchContext";

const SearchPage = () => {
  const { criteria } = useSearchContext();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await searchBuses(criteria);
        // backend returns array directly or wrapped in data
        setBuses(Array.isArray(res) ? res : res.data || []);
      } catch (err) {
        setError("Failed to fetch buses. Please try again.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchBuses();
  }, [criteria]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : buses.length === 0 ? (
        <p>No buses found.</p>
      ) : (
        buses.map((bus) => (
          <BusResultCard key={bus._id} route={bus} />
        ))
      )}
    </div>
  );
};

export default SearchPage;