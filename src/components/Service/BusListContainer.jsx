import React from "react";
import { FaBus, FaSlidersH, FaTimes } from "react-icons/fa";
import BusCard from "./BusCard";
import FilterSidebar from "./FilterSidebar";

const BusListContainer = ({
  filteredBuses,
  loading,
  from,
  to,
  date,
  sortBy,
  setSortBy,
  expandedCard,
  setExpandedCard,
  selectedBoardingPoint,
  setSelectedBoardingPoint,
  selectedDroppingPoint,
  setSelectedDroppingPoint,
  onBookNow,
  showFilter,
  setShowFilter,
  filters,
  setFilters,
  onClearAllFilters,
  maxPrice
}) => {
  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="hidden lg:block w-80">
        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClearAll={onClearAllFilters}
            availableBusesCount={filteredBuses.length}
            maxPrice={maxPrice}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
          >
            <FaSlidersH /> Filters {showFilter && <FaTimes />}
          </button>
          {showFilter && (
            <div className="mt-4 bg-white rounded-xl shadow-sm border p-6">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                onClearAll={onClearAllFilters}
                availableBusesCount={filteredBuses.length}
                maxPrice={maxPrice}
              />
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {from} → {to}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(date).toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })} • {filteredBuses.length} buses found
            </p>
          </div>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d84e55]"
          >
            <option value="">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="departure">Departure Time</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Searching for buses...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredBuses.length === 0 && (
          <div className="text-center py-12">
            <FaBus className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No buses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Bus Cards */}
        <div className="space-y-4">
          {filteredBuses.map((bus) => (
            <BusCard
              key={bus.id}
              bus={bus}
              expandedCard={expandedCard}
              setExpandedCard={setExpandedCard}
              selectedBoardingPoint={selectedBoardingPoint}
              setSelectedBoardingPoint={setSelectedBoardingPoint}
              selectedDroppingPoint={selectedDroppingPoint}
              setSelectedDroppingPoint={setSelectedDroppingPoint}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusListContainer;