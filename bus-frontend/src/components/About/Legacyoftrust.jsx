import React from 'react';
import Aboutbg from '../../assets/Images/Aboutbg.png';

const Legacyoftrust = () => {
  const trustdata = [
    {
      img: "https://i.pinimg.com/736x/74/5d/2a/745d2a1545e438c93ef2898546023a0e.jpg",
      desc: "Reliable Service"
    },
    {
      img: "https://i.pinimg.com/736x/22/5a/b0/225ab0b2116338faf91cd89f868d8a54.jpg", 
      desc: "Safety First"
    },
    {
      img: "https://i.pinimg.com/736x/4a/cb/5b/4acb5b80ad433be5993bd3e4c0ae0739.jpg",
      desc: "Luxury Fleet"
    },
  ];

  return (
    <section className="relative py-16 px-4 md:px-10 lg:px-20 overflow-hidden">
      
     
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        
       
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest">
            Since 2004
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            A Legacy of <span className="text-orange-500">Trust</span>
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
            With over two decades of experience, Raj Mudra has become a symbol of reliability in the travel industry. Our commitment to your comfort makes every journey memorable.
          </p>

          
          <div className="flex flex-row gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {trustdata.map((item, index) => (
              <div key={index} className="min-w-[160px] md:min-w-[180px] group">
                <div className="relative h-28 w-full overflow-hidden rounded-xl shadow-sm border border-white">
                  <img 
                    src={item.img} 
                    alt={item.desc} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mt-2 text-center group-hover:text-orange-500 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative">
          {/* Decorative Glow behind the image */}
          <div className="" />
          
          <div className="relative bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500  hover:shadow-3xl">
           
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img 
                src={Aboutbg} 
                alt="Our Heritage" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

           
            <div className="p-8 md:p-10 -mt-12 relative z-10">
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-50">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Heritage</h3>
                <p className="text-slate-500 leading-relaxed text-sm md:text-base">
Rajmudra Travels is inspired by the rich heritage and values of Maharashtra, symbolizing trust and pride.
Rooted in the legacy of Chhatrapati Shivaji Maharaj, we stand for safety, discipline, and customer-first service.
Our journey reflects a commitment to connecting people with comfort and reliability.
We carry forward tradition while delivering modern, dependable travel experiences.                </p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 w-12 bg-orange-500 rounded-full" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Raj Mudra Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Legacyoftrust;