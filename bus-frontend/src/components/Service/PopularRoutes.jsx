import React from "react";
import { useNavigate } from "react-router-dom";

const PopularRoutes = () => {
  const navigate = useNavigate();

  const goToBooking = ({ origin, destination } = {}) => {
    if (origin && destination) {
      navigate(`/s-to-d?from=${origin}&to=${destination}`);
    } else {
      navigate("/");
    }
  };

  const routes = [
    { from: "Mumbai", to: "Pune", duration: "3.5 hrs", price: "₹450", frequency: "Every 30 mins", img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80" },
    { from: "Delhi", to: "Jaipur", duration: "5 hrs", price: "₹650", frequency: "Every hour", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80" },
    { from: "Bangalore", to: "Mysore", duration: "4 hrs", price: "₹550", frequency: "Every 45 mins", img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
    { from: "Chennai", to: "Pondicherry", duration: "3 hrs", price: "₹400", frequency: "Every hour", img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80" },
    { from: "Kolkata", to: "Darjeeling", duration: "12 hrs", price: "₹1,200", frequency: "Daily departures", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" },
    { from: "Ahmedabad", to: "Udaipur", duration: "6 hrs", price: "₹750", frequency: "Twice daily", img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80" },
  ];

  return (
    <div className="bg-white py-16 px-4 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-1.5 w-20 bg-orange-500 rounded-full mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Popular <span className="text-orange-500">Routes</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Discover our most traveled routes connecting major cities across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img src={route.img} alt={`${route.from} to ${route.to}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-2xl font-bold">{route.from}</span>
                    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-2xl font-bold">{route.to}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="font-bold text-gray-900">{route.duration}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Starting From</p>
                    <p className="font-bold text-orange-600">{route.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span>{route.frequency}</span>
                </div>

                <button
                  type="button"
                  onClick={() => goToBooking({ origin: route.from, destination: route.to })}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  Book This Route
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            type="button"
            onClick={() => goToBooking()}
            className="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-10 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
          >
            View All Routes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopularRoutes;
