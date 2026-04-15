import React from "react";
import { useNavigate } from "react-router-dom";

const ServiceHero = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-center bg-cover bg-no-repeat"
      style={{ 
        backgroundImage: `url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80)` 
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <div className="h-1.5 w-20 bg-orange-500 rounded-full mb-6 animate-pulse"></div>
        
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase">
          Our <span className="text-orange-500">Services</span>
        </h1>
        
        <p className="text-gray-200 mt-6 max-w-3xl text-lg md:text-xl font-light leading-relaxed">
          Experience excellence in every journey with our premium bus services. 
          From luxury coaches to express routes, we have everything you need for comfortable travel.
        </p>
        
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
          >
            Book Now
          </button>
   
        </div>
      </div>

 
    </div>
  );
};

export default ServiceHero;
