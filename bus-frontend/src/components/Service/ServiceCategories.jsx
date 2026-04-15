import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceCategories = () => {
  const [activeService, setActiveService] = useState(null);
  const navigate = useNavigate();

  const services = [
    {
      title: "Luxury Coaches",
      img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      desc: "Experience ultimate comfort with our premium luxury coaches featuring plush seating, personal entertainment, and onboard refreshments.",
      features: ["Reclining Seats", "WiFi", "Entertainment System", "Refreshments"],
      color: "orange"
    },
    {
      title: "Express Routes",
      img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
      desc: "Fast and efficient express services connecting major cities with minimal stops for time-conscious travelers.",
      features: ["Non-Stop Routes", "Quick Transit", "Priority Boarding", "GPS Tracking"],
      color: "blue"
    },
    {
      title: "Corporate Travel",
      img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
      desc: "Customized transportation solutions for corporate events, team outings, and business travel needs.",
      features: ["Fleet Booking", "Custom Routes", "Professional Service", "24/7 Support"],
      color: "orange"
    },
    {
      title: "Tourist Packages",
      img: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80",
      desc: "Curated travel packages to popular destinations with experienced guides and comfortable accommodations.",
      features: ["Guided Tours", "Hotel Bookings", "Meal Plans", "Sightseeing"],
      color: "blue"
    },
    {
      title: "Airport Transfers",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
      desc: "Reliable and punctual airport shuttle services ensuring you never miss your flight with door-to-door convenience.",
      features: ["Pickup Service", "Flight Tracking", "Luggage Assistance", "On-Time Guarantee"],
      color: "orange"
    },
    {
      title: "Charter Services",
      img: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80",
      desc: "Book entire buses for private events, weddings, school trips, or any group occasion with flexible scheduling.",
      features: ["Private Bus", "Custom Schedule", "Event Planning", "Dedicated Driver"],
      color: "blue"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 px-4 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Our <span className="text-orange-500">Service Categories</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Comprehensive travel solutions tailored to meet every need and journey requirement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold">{service.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.desc}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${service.color === 'orange' ? 'bg-orange-400' : 'bg-orange-400'}`}></div>
                      <span className="text-gray-700 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => setActiveService(service)}
                  className={`w-full py-3 rounded-full font-bold cursor-pointer transition-all duration-300 ${
                    service.color === 'orange' 
                      ? 'bg-orange-400 hover:bg-blue-400 text-white' 
                      : 'bg-orange-400 hover:bg-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  }`}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      
        {activeService && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 text-sm font-bold text-gray-400 hover:text-gray-600"
                aria-label="Close details"
              >
                Close
              </button>
              <h3 className="text-3xl font-black text-gray-900 mb-4">{activeService.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{activeService.desc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {activeService.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                    {feature}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setActiveService(null)}
                  className="flex-1 border border-gray-200 rounded-2xl py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveService(null);
                    navigate("/");
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-3 font-bold shadow-lg"
                >
                  Plan This Service
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCategories;
