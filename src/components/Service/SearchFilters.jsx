import React from "react";

const SearchFilters = ({ filters, setFilters, onClearAll, availableBusesCount, maxPrice }) => {
  const toggleType = (item) =>
    setFilters((prev) => ({
      ...prev,
      busTypes: prev.busTypes.includes(item)
        ? prev.busTypes.filter((x) => x !== item)
        : [...prev.busTypes, item],
    }));

  const toggleTime = (item) =>
    setFilters((prev) => ({
      ...prev,
      departureTimes: prev.departureTimes.includes(item)
        ? prev.departureTimes.filter((x) => x !== item)
        : [...prev.departureTimes, item],
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Filters ({availableBusesCount} buses)
        </h4>
        <button onClick={onClearAll} className="text-xs text-[#d84e55] hover:underline font-semibold">
          Clear All
        </button>
      </div>

      {/* Bus Type */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Bus Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {["AC", "Non AC", "Seater", "Sleeper"].map((item) => (
            <button
              key={item}
              onClick={() => toggleType(item)}
              className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                filters.busTypes.includes(item)
                  ? "bg-[#d84e55] text-white border-[#d84e55]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#d84e55] hover:text-[#d84e55]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Price Range — Bug 10: capped to actual route max */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Price Range (₹{filters.priceRange.min} – ₹{filters.priceRange.max})
        </h4>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={filters.priceRange.max}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: { ...prev.priceRange, max: parseInt(e.target.value) },
            }))
          }
          className="w-full accent-[#d84e55]"
        />
        <div className="flex justify-between text-xs font-semibold text-gray-500 mt-1">
          <span>₹0</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Departure Time */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Departure Time</h4>
        <div className="grid grid-cols-2 gap-2">
          {["Before 10 AM", "10 AM–5 PM", "5 PM–11 PM", "After 11 PM"].map((t) => (
            <button
              key={t}
              onClick={() => toggleTime(t)}
              className={`py-2 px-2 rounded-lg text-xs font-semibold border transition text-center ${
                filters.departureTimes.includes(t)
                  ? "bg-[#d84e55] text-white border-[#d84e55]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#d84e55] hover:text-[#d84e55]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Min Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Min Rating</h4>
        <div className="flex gap-2">
          {[3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() =>
                setFilters((prev) => ({ ...prev, minRating: prev.minRating === r ? 0 : r }))
              }
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition ${
                filters.minRating === r
                  ? "bg-[#d84e55] text-white border-[#d84e55]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#d84e55] hover:text-[#d84e55]"
              }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
