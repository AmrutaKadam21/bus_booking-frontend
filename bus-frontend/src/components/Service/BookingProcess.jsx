import React from "react";
import { useNavigate } from "react-router-dom";

const BookingProcess = () => {
  const navigate = useNavigate();

  const steps = [
    { number: "01", title: "Select Your Route", desc: "Choose your departure and destination cities from our extensive network of routes.", icon: "🗺️" },
    { number: "02", title: "Pick Date & Time", desc: "Select your preferred travel date and time slot that fits your schedule.", icon: "📅" },
    { number: "03", title: "Choose Your Seat", desc: "View the bus layout and select your preferred seat from available options.", icon: "💺" },
    { number: "04", title: "Secure Payment", desc: "Complete your booking with our secure payment gateway and receive instant confirmation.", icon: "💳" },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-orange-50/30 to-white py-16 px-4 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
            Simple <span className="text-orange-500">Booking Process</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Book your bus tickets in just 4 easy steps. Quick, secure, and hassle-free.
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 transform -translate-y-1/2 mx-32"></div>
            <div className="grid grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mx-auto w-32 h-32 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <div className="text-4xl">{step.icon}</div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-3xl">
                    {step.icon}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="absolute left-14 bottom-0 w-0.5 h-6 bg-orange-300 transform translate-y-full"></div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(249,115,22,0.4)]"
          >
            Start Booking Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingProcess;
