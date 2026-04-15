import React, { useRef, useEffect } from "react";
import { FcRating } from "react-icons/fc";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    img: "https://i.pinimg.com/736x/2e/f8/39/2ef83928873282d968e9f6c497df8c37.jpg",
    name: "Siddesh Jadhav",
    role: "Verified Traveler",
    desc: "The Raj Mudra Travelers provided an exceptional travel experience. The bus was clean and comfortable, the staff were friendly and professional.",
  },
  {
    img: "https://i.pinimg.com/1200x/a4/ad/e3/a4ade34601af89c976de99b6c1cb42a5.jpg",
    name: "Vivek Jangam",
    role: "Regular Commuter",
    desc: "Exceptional service! The punctuality of Raj Mudra is what keeps me coming back. Best premium bus service in the city by far.",
  },
  {
    img: "https://i.pinimg.com/736x/2e/f8/39/2ef83928873282d968e9f6c497df8c37.jpg",
    name: "Abhi Jagtap",
    role: "Business Traveler",
    desc: "Cleanliness and comfort are my top priorities, and Raj Mudra delivers both perfectly. The staff goes above and beyond for passengers.",
  },
  {
    img: "https://i.pinimg.com/736x/94/84/53/948453da7013aa0adab11e82b3237057.jpg",
    name: "Akash Mahade",
    role: "Verified Traveler",
    desc: "A truly hassle-free experience. From booking to drop-off, everything was seamless. Highly recommended for long distance travel.",
  },
];

const Testimonalies = () => {
  const sectionRef = useRef(null);
  const cardRefs   = useRef([]);

  // Scroll-driven parallax stagger reveal
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect   = sectionRef.current.getBoundingClientRect();
      const viewH  = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)));

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        // Each card starts at a different Y offset and converges to 0
        const delay  = i * 0.12;
        const p      = Math.max(0, Math.min(1, progress - delay));
        const yStart = 60 + i * 20;
        const y      = yStart * (1 - p);
        const opacity = p;
        el.style.transform = `translateY(${y}px)`;
        el.style.opacity   = opacity;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 px-4 md:px-10 lg:px-20"
      style={{
        background:
          "radial-gradient(circle at top right, #fff7ed 0%, #f8fafc 50%, #eff6ff 100%)",
      }}
    >
      {/* Parallax background dots */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #f97316 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-4">
          <div className="text-center md:text-left">
            <span className="text-orange-500 font-black text-xs tracking-[0.25em] uppercase block mb-2">
              ✦ Passenger Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Voices of Our{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#f97316,#dc2626)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Passengers
              </span>
            </h2>
            <p className="text-slate-500 mt-3 text-base italic">
              Real stories from real travelers who choose Raj Mudra.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md">
            <span className="text-2xl font-black text-slate-900">4.8</span>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <FcRating key={i} className="text-sm" />)}
              </div>
              <p className="text-xs text-slate-400 font-semibold">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((test, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="group relative bg-white/80 backdrop-blur-md border border-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-orange-200/40 transition-shadow duration-500 flex flex-col h-full will-change-transform"
              style={{ opacity: 0, transform: `translateY(${60 + i * 20}px)` }}
            >
              <FaQuoteLeft className="text-orange-200 text-3xl mb-4 group-hover:text-orange-400 transition-colors duration-300" />

              <div className="flex-grow">
                <p className="text-slate-600 text-sm leading-relaxed italic mb-6">
                  "{test.desc}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-5 border-t border-slate-100">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-orange-400 p-0.5 shrink-0">
                  <img
                    src={test.img}
                    alt={test.name}
                    className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-none">{test.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{test.role}</p>
                </div>
              </div>

              {/* Corner glow */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonalies;
