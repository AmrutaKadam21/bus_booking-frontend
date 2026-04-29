import React, { useEffect, useState } from "react";

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  dur: 2.5 + Math.random() * 3,
  delay: Math.random() * 3,
  color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#fbbf24" : "rgba(255,255,255,0.6)",
}));

const RINGS = [
  { size: 180, dur: 3.2, delay: 0.8 },
  { size: 320, dur: 4.0, delay: 1.2 },
  { size: 480, dur: 5.0, delay: 1.6 },
];

const SplashScreen = ({ onDone }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 3000);
    const t2 = setTimeout(() => onDone(), 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transition: exiting ? "opacity 0.85s cubic-bezier(0.4,0,0.2,1) 0.15s" : "none",
        pointerEvents: exiting ? "none" : "all",
      }}
    >
      <style>{`
        @keyframes sp-float {
          0%,100% { transform: translateY(0) scale(1);    opacity: var(--op); }
          50%      { transform: translateY(-20px) scale(1.25); opacity: calc(var(--op) * 1.7); }
        }
        @keyframes sp-ring {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0; }
          25%  { opacity: 0.15; }
          100% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }
        @keyframes sp-icon-in {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          55%  { transform: scale(1.18) rotate(3deg);  opacity: 1; }
          75%  { transform: scale(0.96) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg);     opacity: 1; }
        }
        @keyframes sp-glow {
          0%,100% { box-shadow: 0 0 28px 5px rgba(249,115,22,0.5),  0 0 65px 18px rgba(249,115,22,0.15); }
          50%      { box-shadow: 0 0 52px 14px rgba(249,115,22,0.72), 0 0 105px 38px rgba(249,115,22,0.26); }
        }
        @keyframes sp-raj {
          0%   { opacity: 0; transform: translateX(-36px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes sp-mudra {
          0%   { opacity: 0; transform: scale(0.45) translateY(12px); }
          100% { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes sp-travels {
          0%   { opacity: 0; transform: translateX(36px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes sp-tag {
          0%   { opacity: 0; transform: translateY(10px); letter-spacing: 7px; }
          100% { opacity: 1; transform: translateY(0);   letter-spacing: 4px; }
        }
        @keyframes sp-shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes sp-shrink {
          0%   { transform: scale(1)    translate(0,0);            opacity: 1; }
          100% { transform: scale(0.09) translate(-480px,-340px);  opacity: 0; }
        }
      `}</style>

      {/* Ambient floating particles */}
      {PARTICLES.map((p) => (
        <span key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: "50%", background: p.color,
          "--op": 0.55,
          animation: `sp-float ${p.dur}s ${p.delay}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Pulsing rings */}
      {RINGS.map((r, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          width: `${r.size}px`, height: `${r.size}px`,
          borderRadius: "50%",
          border: "1.5px solid rgba(249,115,22,0.45)",
          animation: `sp-ring ${r.dur}s ${r.delay}s ease-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Central radial glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "580px", height: "580px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.03) 50%, transparent 70%)",
        "--op": 1,
        animation: "sp-float 4s 0.5s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Main logo block */}
      <div style={{
        display: "flex", alignItems: "center", gap: "20px",
        transformOrigin: "center center",
        animation: exiting ? "sp-shrink 0.9s cubic-bezier(0.55,0,1,0.45) forwards" : "none",
      }}>

        {/* Icon box */}
        <div style={{
          width: "80px", height: "80px", borderRadius: "20px",
          background: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          animation: "sp-icon-in 0.7s 0.1s cubic-bezier(0.34,1.56,0.64,1) both, sp-glow 2.5s 0.8s ease-in-out infinite",
        }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="white">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
          </svg>
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

          {/* Brand name */}
          <div style={{
            display: "flex", alignItems: "baseline", gap: "10px",
            fontSize: "clamp(32px, 6vw, 52px)",
            fontWeight: 900,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.5px", lineHeight: 1, whiteSpace: "nowrap",
          }}>
            <span style={{ color: "#fff", animation: "sp-raj 0.55s 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              Raj
            </span>
            <span style={{
              background: "linear-gradient(90deg,#f97316 0%,#fbbf24 30%,#fff 50%,#fbbf24 70%,#f97316 100%)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              animation: "sp-mudra 0.65s 0.55s cubic-bezier(0.34,1.56,0.64,1) both, sp-shimmer 3s 1.2s linear infinite",
            }}>
              Mudra
            </span>
            <span style={{ color: "#fff", animation: "sp-travels 0.55s 0.75s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              Travels
            </span>
          </div>

          {/* Tagline only — no underline/progress bar */}
          <div style={{
            fontSize: "clamp(9px, 1.4vw, 12px)",
            color: "rgba(255,255,255,0.4)",
            fontWeight: 700,
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
            animation: "sp-tag 0.6s 1.0s cubic-bezier(0.4,0,0.2,1) both",
          }}>
            India's Fastest Booking Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
