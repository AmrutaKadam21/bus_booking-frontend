import React, { useRef, useEffect } from "react";

const cards = [
  {
    title: "Luxury Buses",
    tag: "Premium Fleet",
    img: "https://plus.unsplash.com/premium_photo-1661963208071-9a65b048ebaf?q=80&w=1170&auto=format&fit=crop",
    desc: "Spacious seating, AC, WiFi, and entertainment on every journey.",
  },
  {
    title: "Safe Journeys",
    tag: "Zero Compromise",
    img: "https://i.pinimg.com/736x/4a/4d/07/4a4d076906de8283314a41d9c5977826.jpg",
    desc: "Professional drivers and strict safety standards for worry-free travel.",
  },
  {
    title: "Expert Staff",
    tag: "Trained Crew",
    img: "https://i.pinimg.com/736x/90/b9/f6/90b9f6ed6aa751f6a53db5c5e4e7e298.jpg",
    desc: "Well-trained staff ensuring smooth and friendly travel experiences.",
  },
  {
    title: "On-Time Service",
    tag: "Punctual Always",
    img: "https://plus.unsplash.com/premium_photo-1661963208071-9a65b048ebaf?q=80&w=1170&auto=format&fit=crop",
    desc: "Punctual departures and arrivals so you always reach on time.",
  },
];

const TiltCard = ({ card, index }) => {
  const cardRef = useRef(null);
  const imgRef  = useRef(null);

  const onMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width  - 0.5;   // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.04)`;
    // Inner image moves opposite direction for depth
    if (imgRef.current) imgRef.current.style.transform = `scale(1.12) translate(${x * -12}px, ${y * -12}px)`;
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale(1)";
    if (imgRef.current) imgRef.current.style.transform = "scale(1) translate(0,0)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="why-card group relative h-80 cursor-pointer will-change-transform"
      style={{
        transition: "transform 0.12s ease-out, box-shadow 0.3s ease",
        animationDelay: `${index * 0.12}s`,
      }}
    >
      <img
        ref={imgRef}
        src={card.img}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
        style={{ transition: "transform 0.12s ease-out" }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 25%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Tag */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full"
          style={{
            background: "rgba(249,115,22,0.88)",
            backdropFilter: "blur(8px)",
          }}
        >
          {card.tag}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
        <h3 className="text-white font-black text-lg tracking-wide">{card.title}</h3>
        <p className="text-white/80 text-sm mt-2 leading-snug opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
          {card.desc}
        </p>
        <div
          className="mt-3 h-0.5 w-0 group-hover:w-full transition-all duration-500 delay-100 rounded-full"
          style={{ background: "linear-gradient(90deg,#f97316,#fbbf24)" }}
        />
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  const sectionRef = useRef(null);

  // Scroll-reveal stagger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".why-card").forEach((card, i) => {
              setTimeout(() => card.classList.add("revealed"), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-10 lg:px-16 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4 reveal-up">
        <div>
          <span className="text-orange-500 font-black text-xs tracking-[0.25em] uppercase block mb-2">
            ✦ Our Promise
          </span>
          <h2
            className="font-black text-slate-900 leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Why Choose{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#f97316,#dc2626)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Raj Mudra?
            </span>
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl text-base leading-relaxed">
            Committed to safe, comfortable, and affordable travel with exceptional service quality.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        style={{ perspective: "1200px" }}
      >
        {cards.map((card, i) => (
          <TiltCard key={i} card={card} index={i} />
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
