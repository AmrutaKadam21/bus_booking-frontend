import React from "react";
import { useNavigate } from "react-router-dom";

const BusFleet = () => {
  const navigate = useNavigate();

  const fleet = [
    { name: "Executive Class", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80", capacity: "45 Seats", features: ["AC", "Reclining Seats", "WiFi", "USB Charging", "Entertainment"], price: "Premium Pricing" },
    { name: "Deluxe Coach", img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80", capacity: "52 Seats", features: ["AC", "Comfortable Seats", "Reading Lights", "Storage Space"], price: "Standard Pricing" },
    { name: "Sleeper Bus", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80", capacity: "40 Berths", features: ["AC", "Sleeping Berths", "Blankets", "Privacy Curtains", "Charging Points"], price: "Night Travel Special" },
  ];

  return (
    <div className="bg-white py-16 px-4 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-1.5 w-20 bg-orange-500 rounded-full mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Our <span className="text-orange-500">Bus Fleet</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Modern, well-maintained buses equipped with the latest amenities for your comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fleet.map((bus, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="relative h-80">
                <img src={bus.img} alt={bus.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-2">{bus.name}</h3>
                    <p className="text-orange-400 font-semibold mb-4">{bus.capacity}</p>
                    <div className="space-y-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {bus.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{bus.price}</span>
                      <button
                        type="button"
                        onClick={() => { navigate("/"); setTimeout(() => document.getElementById("home-search")?.scrollIntoView({ behavior: "smooth" }), 100); }}
                        className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusFleet;
