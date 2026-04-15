import React, { useState } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const cities = [
  "Mumbai",
  "Pune",
  "Nashik",
  "Nagpur",
  "Kolhapur",
  "Aurangabad",
  "Solapur",
  "Satara",
  "Ahmednagar",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
];

const Search = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  // Filter cities
  const filterCities = (value) => {
    return cities.filter((city) =>
      city.toLowerCase().includes(value.toLowerCase())
    );
  };

  // Swap function
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };


  const navigate = useNavigate();

  
const handleSearch = () => {
  if (!from || !to) {
    alert("Please enter both cities");
    return;
  }

  const user = localStorage.getItem("user");

  if (!user) {
    navigate("/register");
    return;
  }

  navigate(`/s-to-d?from=${from}&to=${to}&date=${date}`);
};


  return (
    <div className="w-full flex justify-center mt-10 px-4">
      <div className="bg-gray-200 rounded-[30px] sm:rounded-[40px] px-4 sm:px-6 py-5 sm:py-6 w-full max-w-6xl shadow-md">

        {/* Top Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-semibold px-2 mb-4">
          <span>🚌 BUSES</span>
          <span className="text-gray-700 text-xs sm:text-sm">
            INDIA'S FASTEST BOOKING PLATFORM
          </span>
        </div>

        <div className="border-t border-gray-300 mb-4"></div>

        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-100 rounded-2xl sm:rounded-full overflow-visible relative">

          {/* FROM */}
          <div className="relative flex items-center gap-3 px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
            <FaMapMarkerAlt className="text-orange-500" />
            <div className="w-full">
              <p className="text-xs text-gray-500 font-semibold">FROM</p>
              <input
                type="text"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowFrom(true);
                }}
                onFocus={() => setShowFrom(true)}
                placeholder="Enter city"
                className="bg-transparent outline-none w-full font-semibold text-lg"
              />

              {/* Suggestions */}
              {showFrom && from && (
                <div className="absolute top-16 left-0 w-full bg-white shadow rounded z-10 max-h-40 overflow-y-auto">
                  {filterCities(from).map((city, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setFrom(city);
                        setShowFrom(false);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SWAP */}
          <div className="hidden sm:flex items-center justify-center">
            <button
              onClick={handleSwap}
              className="bg-white p-2 rounded-full shadow"
            >
              <MdSwapHoriz className="text-orange-500 text-xl" />
            </button>
          </div>

          {/* TO */}
          <div className="relative flex items-center gap-3 px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
            <FaMapMarkerAlt className="text-orange-500" />
            <div className="w-full">
              <p className="text-xs text-gray-500 font-semibold">TO</p>
              <input
                type="text"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowTo(true);
                }}
                onFocus={() => setShowTo(true)}
                placeholder="Enter city"
                className="bg-transparent outline-none w-full font-semibold text-lg"
              />

              {/* Suggestions */}
              {showTo && to && (
                <div className="absolute top-16 left-0 w-full bg-white shadow rounded z-10 max-h-40 overflow-y-auto">
                  {filterCities(to).map((city, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setTo(city);
                        setShowTo(false);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DATE */}
          <div className="px-5 py-4 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
            <p className="text-xs text-gray-500 font-semibold">DEPARTURE</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent outline-none font-semibold text-lg"
            />
          </div>

          {/* SEARCH BUTTON */}
          <div className="px-4 py-3 sm:py-0">
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 font-bold text-lg"
            >
              <FaSearch />
              SEARCH
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Search;