import React, { useState } from "react";
import { FaMapMarkerAlt, FaSearch, FaSyncAlt, FaCalendarAlt } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import useCities from "../../hooks/useCities";

const today = new Date().toISOString().split("T")[0];

// Bug 9: format "2026-05-01" → "01 May 2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
};

const CityDropdown = ({ label, value, setValue, show, setShow, setOtherShow, cities }) => {
  const filtered = cities.filter((c) => c.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative flex items-center gap-3 px-5 py-3 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300">
      <FaMapMarkerAlt className="text-orange-500 shrink-0" />
      <div className="w-full">
        <p className="text-xs text-gray-500 font-semibold">{label}</p>
        <input
          type="text"
          value={value}
          placeholder="Enter city"
          onChange={(e) => { setValue(e.target.value); setShow(true); setOtherShow(false); }}
          onFocus={() => { setShow(true); setOtherShow(false); }}
          onBlur={() => setTimeout(() => setShow(false), 150)}
          className="bg-transparent outline-none w-full font-semibold text-base"
        />
        {/* Show all cities on focus (empty input) OR filtered matches */}
        {show && (value ? filtered.length > 0 : cities.length > 0) && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg z-50 max-h-48 overflow-y-auto border border-gray-100 mt-1">
            {(value ? filtered : cities).map((city, i) => (
              <div
                key={i}
                onMouseDown={() => { setValue(city); setShow(false); }}
                className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm text-gray-700"
              >
                <FaMapMarkerAlt className="text-orange-400 text-xs shrink-0" />
                {city}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SearchBar = ({ from, setFrom, to, setTo, date, setDate, onSearch, onRefresh }) => {
  const cities = useCities();
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSwap = () => { setFrom(to); setTo(from); };

  return (
    <div className="w-full flex justify-center py-4 px-4 bg-white shadow-sm">
      <div className="bg-gray-200 rounded-[30px] sm:rounded-[40px] px-4 sm:px-6 py-4 w-full max-w-6xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-semibold px-2 mb-3">
          <span>🚌 BUSES</span>
          <span className="text-gray-700 text-xs sm:text-sm">INDIA'S FASTEST BOOKING PLATFORM</span>
        </div>

        <div className="border-t border-gray-300 mb-3" />

        <div className="flex flex-col sm:flex-row items-stretch bg-gray-100 rounded-2xl sm:rounded-full overflow-visible relative">

          <CityDropdown label="FROM" value={from} setValue={setFrom} show={showFrom} setShow={setShowFrom} setOtherShow={setShowTo} cities={cities} />

          <div className="hidden sm:flex items-center justify-center px-1">
            <button onClick={handleSwap} className="bg-white p-2 rounded-full shadow hover:shadow-md transition">
              <MdSwapHoriz className="text-orange-500 text-xl" />
            </button>
          </div>

          <CityDropdown label="TO" value={to} setValue={setTo} show={showTo} setShow={setShowTo} setOtherShow={setShowFrom} cities={cities} />

          {/* Date — min=today, formatted display */}
          <div className="relative px-5 py-3 sm:w-1/4 border-b sm:border-b-0 sm:border-r border-gray-300 flex flex-col justify-center">
            <p className="text-xs text-gray-500 font-semibold">DEPARTURE</p>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowDatePicker(true)}>
              <FaCalendarAlt className="text-orange-400 text-sm shrink-0" />
              <span className="font-semibold text-base text-gray-800">
                {date ? formatDate(date) : <span className="text-gray-400 font-normal text-sm">Select date</span>}
              </span>
            </div>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => { setDate(e.target.value); setShowDatePicker(false); }}
              onBlur={() => setShowDatePicker(false)}
              className={`absolute inset-0 opacity-0 cursor-pointer w-full h-full ${showDatePicker ? "block" : "hidden"}`}
              style={{ zIndex: 10 }}
              autoFocus={showDatePicker}
            />
          </div>

          <div className="flex items-stretch gap-2 px-3 py-2 sm:py-0">
            <button
              onClick={onRefresh}
              title="Clear / Refresh"
              className="self-stretch sm:my-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 rounded-full flex items-center justify-center transition"
            >
              <FaSyncAlt className="text-sm" />
            </button>
            <button
              onClick={onSearch}
              className="self-stretch sm:my-2 bg-red-600 hover:bg-red-700 text-white px-6 rounded-full flex items-center justify-center gap-2 font-bold text-sm transition"
            >
              <FaSearch /> SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
