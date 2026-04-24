import React from 'react'
import { FaBusSimple } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";


import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


const Footer = () => {

   const navigate=useNavigate();
  return (
    <footer className="bg-black text-white mt-16 ">

 
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

       
        <div>
          <h2 className="text-xl lg:text-2xl font-bold flex gap-2">
           <FaBusSimple className="text-orange-400 text-lg md:text-2xl mt-1" />  Raj<span className="text-orange-400"> Mudra </span>Travels
          </h2>

          <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-sm">
            We provide the best services in the travel and bus industry across
            Maharashtra, ensuring safe, comfortable, and reliable journeys.
          </p>
        </div>

        
        <div className='flex flex-col gap-2'>
          <h3 className="text-lg font-semibold mb-4 md:text-center lg:text-center">
            Quick Links
          </h3>

          <ul className="  text-white/70 text-sm  md: flex flex-col md:items-center lg:items-center gap-2 ">
            <li><a href="/" className="hover:text-orange-400 transition">Bus Booking</a></li>
            <li><a href="/About" className="hover:text-orange-400 transition"onClick={() => navigate("/About")}>About Us</a></li>
            <li><a href="/Service
            " className="hover:text-orange-400 transition"onClick={()=>navigate("/Service")}>Services</a></li>
            <li><a href="/Contact" className="hover:text-orange-400 transition" onClick={()=>navigate("/Contact")}>Contact</a></li>
          </ul>
        </div>


        <div>
          <h3 className="text-lg font-semibold mb-4">
            Contact Us
          </h3>

          <div className="text-white/70 text-sm space-y-2 ">
        
            <p>   <MdLocationPin size={25} className='inline-block text-white' /> Pimple Saudagar Main Street Pune, Maharashtra</p>
            <p > Phone: +91 73852 6844309</p>
            <p> <MdOutlineMailOutline size={20} className='inline-block text-white mr-2'/>Email: rajmudratravels@gmail.com</p>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      <div className="text-center text-white/60 text-sm py-4">
        © 2025 Raj Mudra Travels. All rights reserved .
      </div>

    </footer>
  );
};

export default Footer;

