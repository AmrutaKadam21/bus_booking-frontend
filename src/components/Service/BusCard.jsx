import React from "react";
import {
  FaBus,
  FaWifi,
  FaSnowflake,
  FaPlug,
  FaShieldAlt,
  FaChevronDown,
  FaChevronUp,
  FaTv,
  FaSuitcase,
} from "react-icons/fa";
import { formatDuration } from "../../utils/timeUtils";

const amenityIcon = (a) => {
  if (a === "WiFi") return <FaWifi className="text-blue-400" />;
  if (a === "AC") return <FaSnowflake className="text-cyan-400" />;
  if (a === "Charging Point") return <FaPlug className="text-yellow-500" />;
  if (a === "Entertainment") return <FaTv className="text-pink-400" />;
  if (a === "Luggage") return <FaSuitcase className="text-green-500" />;
  if (a === "Blanket") return <FaShieldAlt className="text-purple-400" />;
  return null;
};

const BusCard = ({ 
  bus, 
  expandedCard, 
  setExpandedCard, 
  selectedBoardingPoint, 
  setSelectedBoardingPoint,
  selectedDroppingPoint, 
  setSelectedDroppingPoint,
  onBookNow 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition">
      <div className="p-6">
        {/* Bus Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{bus.name}</h3>
            <p className="text-sm text-gray-500">{bus.type} • {bus.busNumber}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-sm font-semibold text-gray-700">{bus.rating}</span>
              <span className="text-yellow-400">★</span>
            </div>
            <p className="text-xs text-gray-500">({Math.floor(Math.random() * 500) + 100} reviews)</p>
          </div>
        </div>

        {/* Route & Time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{bus.departure}</p>
              <p className="text-xs text-gray-500">{bus.from}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500 mb-1">{formatDuration(bus.duration)}</p>
              <div className="h-px bg-gray-300 relative">
                <FaBus className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-[#d84e55] text-sm" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{bus.arrival}</p>
              <p className="text-xs text-gray-500">{bus.to}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#d84e55]">₹{bus.price}</p>
            <p className="text-xs text-gray-500">{bus.totalSeats - (bus.bookedSeats?.length || 0)} seats available</p>
          </div>
        </div>

        {/* Amenities */}
        {bus.amenities && bus.amenities.length > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-gray-500">AMENITIES:</span>
            <div className="flex gap-2">
              {bus.amenities.slice(0, 4).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                  {amenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
              {bus.amenities.length > 4 && <span className="text-xs text-gray-500">+{bus.amenities.length - 4} more</span>}
            </div>
          </div>
        )}

        {/* Boarding & Dropping Points */}
        {(bus.boarding?.length > 0 || bus.dropping?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {bus.boarding?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">BOARDING POINT</label>
                <select
                  value={selectedBoardingPoint[bus.id] || ""}
                  onChange={(e) => setSelectedBoardingPoint(prev => ({ ...prev, [bus.id]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d84e55]"
                >
                  <option value="">Select boarding point</option>
                  {bus.boarding.map((point, idx) => (
                    <option key={idx} value={point}>{point}</option>
                  ))}
                </select>
              </div>
            )}
            {bus.dropping?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">DROPPING POINT</label>
                <select
                  value={selectedDroppingPoint[bus.id] || ""}
                  onChange={(e) => setSelectedDroppingPoint(prev => ({ ...prev, [bus.id]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d84e55]"
                >
                  <option value="">Select dropping point</option>
                  {bus.dropping.map((point, idx) => (
                    <option key={idx} value={point}>{point}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setExpandedCard(expandedCard === bus.id ? null : bus.id)}
            className="flex items-center gap-2 text-[#d84e55] hover:text-red-600 transition text-sm font-semibold"
          >
            More Details {expandedCard === bus.id ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            onClick={() => onBookNow(bus)}
            className="px-6 py-2 bg-[#d84e55] text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Book Now
          </button>
        </div>

        {/* Expanded Details */}
        {expandedCard === bus.id && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Bus Information</h4>
                <div className="space-y-1 text-gray-600">
                  <p><span className="font-medium">Total Seats:</span> {bus.totalSeats}</p>
                  <p><span className="font-medium">Available:</span> {bus.totalSeats - (bus.bookedSeats?.length || 0)}</p>
                  <p><span className="font-medium">Bus Type:</span> {bus.originalType}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Journey Details</h4>
                <div className="space-y-1 text-gray-600">
                  <p><span className="font-medium">Duration:</span> {formatDuration(bus.duration)}</p>
                  <p><span className="font-medium">Distance:</span> ~{Math.floor(Math.random() * 300) + 100} km</p>
                  <p><span className="font-medium">Operator:</span> {bus.name}</p>
                </div>
              </div>
            </div>
            {bus.amenities && bus.amenities.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">All Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {bus.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center gap-1">
                      {amenityIcon(amenity)}
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusCard;