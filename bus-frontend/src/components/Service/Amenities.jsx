import React from "react";
import { useNavigate } from "react-router-dom";
import { FaThermometerHalf, FaWifi, FaPlug, FaFilm, FaUtensils, FaShieldAlt, FaRestroom, FaCouch, FaSuitcase } from "react-icons/fa";

const Amenities = () => {
  const navigate = useNavigate();

  const amenities = [
    { icon: FaThermometerHalf, title: "Climate Control", desc: "Individual temperature control for personalized comfort throughout your journey." },
    { icon: FaWifi, title: "High-Speed WiFi", desc: "Stay connected with complimentary high-speed internet on all our buses." },
    { icon: FaPlug, title: "USB & Power Outlets", desc: "Keep your devices charged with USB ports and power outlets at every seat." },
    { icon: FaFilm, title: "Entertainment System", desc: "Enjoy movies, music, and shows on personal screens with premium content." },
    { icon: FaUtensils, title: "Complimentary Refreshments", desc: "Enjoy snacks and beverages provided on longer journeys." },
    { icon: FaShieldAlt, title: "Safety Features", desc: "GPS tracking, CCTV cameras, and emergency equipment for your safety." },
    { icon: FaRestroom, title: "Clean Restrooms", desc: "Well-maintained washrooms available on select long-distance routes." },
    { icon: FaCouch, title: "Extra Legroom", desc: "Spacious seating with ample legroom for a comfortable journey." },
    { icon: FaSuitcase, title: "Luggage Space", desc: "Generous storage compartments for your luggage and belongings." },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            World-Class <span className="text-orange-500">Amenities</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Travel in style and comfort with premium amenities designed for an exceptional journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
              <div key={index} className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="text-5xl mb-4 text-orange-500 transition-transform duration-300">
                  <IconComponent />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{amenity.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{amenity.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-2xl p-8 md:p-12 shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Experience Premium Travel Today</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">Book your journey now and enjoy all these amazing amenities at no extra cost.</p>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-blue-400 hover:bg-orange-500 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Book Your Seat Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Amenities;
