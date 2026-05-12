import React from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";

const cities = [
  "Mumbai", "Pune", "Nashik", "Nagpur", "Kolhapur",
  "Aurangabad", "Solapur", "Satara", "Ahmednagar",
  "Delhi", "Bangalore", "Hyderabad", "Chennai",
];

const SearchBar = ({
  from, setFrom, to, setTo, date, setDate,
  showFrom, setShowFrom, showTo, setShowTo,
  onSearch, onSwapCities
}) => {
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* From */}
          <div className="relative flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">FROM</label>
            <div className="relative">
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={() => setShowFrom(true)}
                onBlur={() => setTimeout(() => setShowFrom(false), 200)}
                placeholder="Departure city"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] focus:border-transparent"
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {showFrom && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                  {cities.filter(city => city.toLowerCase().includes(from.toLowerCase())).map((city) => (
                    <div 
                      key={city} 
                      onClick={() => { setFrom(city); setShowFrom(false); }} 
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap */}
          <button 
            onClick={onSwapCities} 
            className="p-2 text-[#d84e55] hover:bg-red-50 rounded-full transition mt-6 lg:mt-0"
          >
            <MdSwapHoriz size={24} />
          </button>

          {/* To */}
          <div className="relative flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">TO</label>
            <div className="relative">
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setShowTo(true)}
                onBlur={() => setTimeout(() => setShowTo(false), 200)}
                placeholder="Destination city"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] focus:border-transparent"
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {showTo && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                  {cities.filter(city => city.toLowerCase().includes(to.toLowerCase())).map((city) => (
                    <div 
                      key={city} 
                      onClick={() => { setTo(city); setShowTo(false); }} 
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 mb-1">DEPARTURE DATE</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d84e55] focus:border-transparent"
            />
          </div>

          {/* Search Button */}
          <button 
            onClick={onSearch} 
            className="px-8 py-3 bg-[#d84e55] text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center gap-2 mt-6 lg:mt-0"
          >
            <FaSearch /> SEARCH
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;