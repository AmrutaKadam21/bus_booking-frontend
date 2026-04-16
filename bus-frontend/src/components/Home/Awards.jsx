import React from 'react';

const Awards = () => {
  const awards = [
    {
      img: "https://i.pinimg.com/736x/4f/bd/37/4fbd37c8bb2c55dd9520e715f77b407f.jpg",
      title: "Best Travel Agency 2022",
      desc: "Awarded for exceptional service and customer satisfaction."
    },
    {
      img: "https://i.pinimg.com/736x/30/49/2e/30492e959c344fbfc742e3a41de987df.jpg",
      title: "Safety Excellence",
      desc: "Recognized for maintaining the highest safety standards in the industry."
    },
    {
      img: "https://homafy.com/wp-content/uploads/2023/04/gold-star-trophy.jpg",
      title: "Customer Choice",
      desc: "Voted #1 for premium comfort and reliable city-to-city services."
    },
    {
      img: "https://m.media-amazon.com/images/I/51-CkdkcJnL.jpg",
      title: "Fleet Innovation",
      desc: "Leading the industry with modern, tech-equipped luxury vehicles."
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 px-4 md:px-10 lg:px-20 
      bg-[#f8fafc] 
      bg-[radial-gradient(circle_at_top_right,_#fff7ed_0%,_#f8fafc_50%,_#eff6ff_100%)]">
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs mb-3 block">
            Achievements
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
            Our <span className="text-orange-500">Excellence</span> Recognized
          </h2>
          <p className="mt-5 text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            With over 20+ years of heritage, our dedication to safety and comfort has been celebrated by industry leaders.
          </p>
          <div className="flex justify-center mt-6">
             <div className="h-1 w-24 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full" />
          </div>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((award, index) => (
            <div
              key={index}
              className="group relative bg-white/60 backdrop-blur-md p-2 rounded-[2.5rem] border border-white transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl "
            >
              {/* Image Container with Inner Border */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-100">
                <img
                  src={`${award.img}?auto=format&fit=crop&w=800&q=80`}
                  alt={award.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Subtle dark overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Text Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
                  {award.title}
                </h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed italic line-clamp-2">
                  "{award.desc}"
                </p>
     
               
              </div>
              
              {/* Card Corner Accents */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-400/10 rounded-full blur-2xl -translate-y-6 translate-x-6 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;