import React, { useRef, useEffect, useState } from "react";
import Search from "./Search";
import bgVideo from "../../assets/Images/bg_video.mp4";

const ImageBackground = () => {
  const sectionRef = useRef(null);
  const ov1Ref     = useRef(null);
  const ov2Ref     = useRef(null);
  const [ready, setReady]     = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      if (ov1Ref.current) ov1Ref.current.style.transform = `translateY(${y * 0.12}px)`;
      if (ov2Ref.current) ov2Ref.current.style.transform = `translateY(${y * 0.05}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textOpacity = Math.max(0, 1 - scrollY / 420);
  const textY       = scrollY * 0.2;

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-black">

      {/* ── Dark fallback shown while video loads ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-orange-950" />

      {/* ── Local bg_video.mp4 — full HD, no blur/filter ── */}
      <video
        src={bgVideo}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setReady(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{
          imageRendering: "crisp-edges",
          willChange: "transform",
        }}
      />

      {/* ── Light cinematic overlay — just enough to pop text, not blur video ── */}
      <div
        ref={ov1Ref}
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          background:
            "linear-gradient(180deg,rgba(0,0,0,0.45) 0%,rgba(0,0,0,0.05) 45%,rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── Subtle orange bottom glow ── */}
      <div
        ref={ov2Ref}
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none will-change-transform"
        style={{
          background:
            "linear-gradient(to top,rgba(194,65,12,0.18) 0%,transparent 100%)",
        }}
      />

      {/* ── Floating particles ── */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="parallax-particle"
          style={{
            left: `${6 + i * 12}%`,
            top:  `${15 + (i % 4) * 18}%`,
            width:  `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            animationDelay:    `${i * 0.6}s`,
            animationDuration: `${3 + i * 0.5}s`,
          }}
        />
      ))}

      {/* ── Floating trust badge ── */}
      <div
        className="absolute top-28 right-6 md:right-16 z-20 hidden sm:block"
        style={{ animation: "floatBadge 3.5s ease-in-out infinite" }}
      >
        <div className="glass-dark rounded-2xl px-5 py-4 text-center">
          <p className="text-orange-400 font-black text-2xl leading-none">30+</p>
          <p className="text-white/70 text-[10px] font-bold tracking-widest uppercase mt-1">
            Years of Trust
          </p>
        </div>
      </div>

      {/* ── Live seats badge ── */}
      <div className="absolute top-28 left-6 md:left-16 z-20 hidden sm:block">
        <div className="glass-dark rounded-full px-4 py-2 flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full bg-green-400"
            style={{
              boxShadow: "0 0 8px #4ade80",
              animation: "livePulse 2s ease-in-out infinite",
            }}
          />
          <span className="text-white/80 text-[10px] font-black tracking-widest uppercase">
            Live Seats
          </span>
        </div>
      </div>

      {/* ── Hero content ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center pt-28 md:pt-36 pb-52 text-center px-6"
        style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}
      >
        {/* Eyebrow pill */}
        <div className="hero-title mb-6">
          <span className="glass-dark text-orange-300 text-xs font-black tracking-[0.22em] uppercase px-5 py-2.5 rounded-full inline-flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-green-400 inline-block"
              style={{
                boxShadow: "0 0 8px #4ade80",
                animation: "livePulse 2s ease-in-out infinite",
              }}
            />
            India's Premium Bus Network
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="hero-title text-white font-black uppercase leading-[1.02] tracking-tight"
          style={{
            fontSize: "clamp(2.6rem,7.5vw,6rem)",
            textShadow: "0 4px 40px rgba(0,0,0,0.6)",
          }}
        >
          Welcome To <br />
          <span className="shimmer-text">Raj Mudra</span> Travels
        </h1>

        <p className="hero-subtitle text-white/60 mt-6 max-w-xl text-base md:text-xl font-medium tracking-wide leading-relaxed">
          Redefining luxury intercity travel — comfort, safety, and punctuality on every route.
        </p>

        {/* CTA buttons */}
        <div className="hero-cta mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => sectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="relative overflow-hidden text-white font-black px-10 py-4 rounded-2xl text-base tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-95"
            style={{
              background: "linear-gradient(135deg,#f97316,#dc2626)",
              boxShadow: "0 8px 32px rgba(249,115,22,0.5)",
            }}
          >
            Book My Seat →
          </button>
          <button
            onClick={() => sectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="glass-dark text-white font-semibold px-8 py-4 rounded-2xl text-base tracking-wide hover:-translate-y-1 hover:bg-white/20 transition-all duration-300"
          >
            View Routes
          </button>
        </div>

        {/* Scroll hint */}
        <div className="hero-cta mt-14 flex flex-col items-center gap-2 text-white/35 text-[10px] tracking-widest uppercase">
          <div className="scroll-mouse" />
          Scroll to explore
        </div>
      </div>

      {/* ── Search bar (overlapping) ── */}
      <div ref={sectionRef} className="relative z-30 w-full -mt-32 md:-mt-24 hero-search">
        <Search />
      </div>
    </div>
  );
};

export default ImageBackground;
