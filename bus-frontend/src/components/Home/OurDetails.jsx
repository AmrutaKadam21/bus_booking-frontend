import React, { useEffect, useRef, useState } from "react";
import { MdAccessTime } from "react-icons/md";
import { FaBus, FaRoute } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";

const fetchMetaSummary = () => Promise.resolve({ routes: 0, bookings: 0, topDestinations: [] });

const defaultStats = [
  { key: "heritage",     icon: <MdAccessTime className="w-8 h-8" />,    value: "30+", label: "Years of Heritage",    description: "Over three decades of trust and reliability on the road." },
  { key: "routes",       icon: <FaBus className="w-8 h-8" />,           value: "0",   label: "Active Routes",        description: "Live inventory sourced directly from our operations center." },
  { key: "bookings",     icon: <HiOutlineUsers className="w-8 h-8" />,  value: "0",   label: "Bookings Confirmed",   description: "Passengers who started journeys with us this season." },
  { key: "destinations", icon: <FaRoute className="w-8 h-8" />,         value: "0",   label: "Top Destinations",     description: "Trending cities booked in the past 30 days." },
];

// Orb config: size, position, parallax speed, color
const orbs = [
  { w: 320, h: 320, top: "-60px",  left: "-60px",  speed: 0.18, color: "rgba(249,115,22,0.12)" },
  { w: 480, h: 480, top: "30%",    right: "-80px",  speed: 0.28, color: "rgba(59,130,246,0.09)" },
  { w: 200, h: 200, bottom: "-40px", left: "40%",  speed: 0.12, color: "rgba(249,115,22,0.08)" },
];

const OurDetails = () => {
  const [stats, setStats] = useState(defaultStats);
  const sectionRef = useRef(null);
  const orbRefs    = useRef([]);
  const cardsRef   = useRef([]);

  // Parallax orbs on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const offset = -rect.top; // positive when scrolled past top
      orbRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `translateY(${offset * orbs[i].speed}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-reveal cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cardsRef.current.forEach((el, i) => {
              if (el) setTimeout(() => el.classList.add("stat-revealed"), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchMetaSummary()
      .then((summary) => {
        setStats((prev) =>
          prev.map((item) => {
            if (item.key === "routes"       && summary.routes !== undefined)              return { ...item, value: `${summary.routes}+` };
            if (item.key === "bookings"     && summary.bookings !== undefined)            return { ...item, value: `${summary.bookings}+` };
            if (item.key === "destinations" && Array.isArray(summary.topDestinations))   return { ...item, value: `${summary.topDestinations.length}` };
            return item;
          })
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-slate-50 py-20 px-4 md:px-10 lg:px-20">

      {/* ── Parallax Orbs ── */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          ref={(el) => (orbRefs.current[i] = el)}
          className="absolute rounded-full blur-3xl pointer-events-none will-change-transform"
          style={{
            width: orb.w,
            height: orb.h,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            background: orb.color,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 reveal-up">
          <div className="max-w-2xl">
            <span className="text-orange-500 font-black tracking-widest uppercase text-xs mb-2 block">
              Stats & Milestones
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              The Journey of{" "}
              <span
                style={{
                  background: "linear-gradient(90deg,#f97316,#ea580c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Raj Mudra
              </span>
            </h2>
            <p className="mt-4 text-slate-500 text-lg leading-relaxed">
              We aren't just moving people — we're moving stories. Our commitment to excellence
              is reflected in every mile we cover.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, i) => (
            <div
              key={item.key}
              ref={(el) => (cardsRef.current[i] = el)}
              className="stat-card group relative bg-white p-8 rounded-3xl shadow-sm cursor-default"
            >
              {/* Icon */}
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                  {item.value}
                </h3>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {item.label}
                </p>
                <div className="w-10 h-1 bg-orange-400 rounded-full origin-left transition-all duration-500 group-hover:w-full" />
                <p className="pt-2 text-slate-500 text-sm leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurDetails;
