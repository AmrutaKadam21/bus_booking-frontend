import React, { useEffect, useState, useRef } from "react";

const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  dur: 2.8 + Math.random() * 2.5,
  delay: Math.random() * 2.5,
  color: i % 3 === 0 ? "#f97316" : i % 3 === 1 ? "#fbbf24" : "rgba(255,255,255,0.5)",
}));

const RINGS = [
  { size: 160, dur: 3.0, delay: 0.7 },
  { size: 300, dur: 3.8, delay: 1.1 },
  { size: 460, dur: 4.8, delay: 1.5 },
];

const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState("enter");
  const logoRef = useRef(null);

  // exitTransform holds the computed CSS transform for the exit animation
  const [exitTransform, setExitTransform] = useState("");

  useEffect(() => {
    const t1 = setTimeout(() => {
      // Measure logo position right before exit starts
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        const logoCenterX = rect.left + rect.width / 2;
        const logoCenterY = rect.top + rect.height / 2;

        // Header logo target: left ~20px from viewport edge, vertically centered in 80px header = top 40px
        // The header logo (icon 36px + text) starts at x=20, y=40 (center)
        const targetX = 20 + 8; // icon is 36px wide, center at 20+18=38, but we want left edge of logo block
        const targetY = 40;     // center of 80px header

        // How much to translate the CENTER of the logo block to reach header logo center
        const tx = targetX + (rect.width * 0.12) / 2 - logoCenterX; // 0.12 = final scale
        const ty = targetY - logoCenterY;

        setExitTransform(`translate(${tx}px, ${ty}px) scale(0.12)`);
      }
      setPhase("exit");
    }, 2800);

    const t2 = setTimeout(() => { onDone(); }, 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === "done") return null;
  const isExiting = phase === "exit";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      opacity: isExiting ? 0 : 1,
      transition: isExiting ? "opacity 0.8s ease 0.25s" : "none",
      pointerEvents: isExiting ? "none" : "all",
    }}>
      <style>{`
        @keyframes sp-float {
          0%,100% { transform:translateY(0) scale(1); opacity:var(--op); }
          50%      { transform:translateY(-18px) scale(1.2); opacity:calc(var(--op)*1.6); }
        }
        @keyframes sp-ring {
          0%   { transform:translate(-50%,-50%) scale(0.4); opacity:0; }
          20%  { opacity:0.18; }
          100% { transform:translate(-50%,-50%) scale(1.6); opacity:0; }
        }
        @keyframes sp-icon-in {
          0%   { transform:scale(0) rotate(-18deg); opacity:0; }
          55%  { transform:scale(1.15) rotate(3deg); opacity:1; }
          75%  { transform:scale(0.97) rotate(-1deg); }
          100% { transform:scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes sp-glow {
          0%,100% { box-shadow:0 0 28px 5px rgba(249,115,22,0.5),0 0 60px 16px rgba(249,115,22,0.15); }
          50%      { box-shadow:0 0 50px 14px rgba(249,115,22,0.72),0 0 100px 36px rgba(249,115,22,0.26); }
        }
        @keyframes sp-raj     { 0%{opacity:0;transform:translateX(-32px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes sp-mudra   { 0%{opacity:0;transform:scale(0.4) translateY(10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes sp-travels { 0%{opacity:0;transform:translateX(32px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes sp-tag     { 0%{opacity:0;transform:translateY(8px);letter-spacing:6px} 100%{opacity:1;transform:translateY(0);letter-spacing:4px} }
        @keyframes sp-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
      `}</style>

      {/* Particles */}
      {PARTICLES.map((p) => (
        <span key={p.id} style={{
          position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
          width:`${p.size}px`, height:`${p.size}px`,
          borderRadius:"50%", background:p.color, "--op":0.5,
          animation:`sp-float ${p.dur}s ${p.delay}s ease-in-out infinite`,
          pointerEvents:"none",
          opacity: isExiting ? 0 : undefined,
          transition: isExiting ? "opacity 0.25s ease" : "none",
        }} />
      ))}

      {/* Rings */}
      {RINGS.map((r, i) => (
        <div key={i} style={{
          position:"absolute", top:"50%", left:"50%",
          width:`${r.size}px`, height:`${r.size}px`,
          borderRadius:"50%", border:"1.5px solid rgba(249,115,22,0.4)",
          animation:`sp-ring ${r.dur}s ${r.delay}s ease-out infinite`,
          pointerEvents:"none",
          opacity: isExiting ? 0 : undefined,
          transition: isExiting ? "opacity 0.2s ease" : "none",
        }} />
      ))}

      {/* Central glow */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:"560px", height:"560px", borderRadius:"50%",
        background:"radial-gradient(circle,rgba(249,115,22,0.11) 0%,rgba(249,115,22,0.03) 50%,transparent 70%)",
        "--op":1, animation:"sp-float 4s 0.5s ease-in-out infinite",
        pointerEvents:"none",
      }} />

      {/* ── Main logo block ── */}
      <div
        ref={logoRef}
        style={{
          display:"flex", alignItems:"center", gap:"16px",
          // transform-origin top-left so it shrinks toward the top-left corner
          transformOrigin: "left center",
          // Apply computed exit transform with smooth transition
          transform: isExiting ? exitTransform : "none",
          transition: isExiting ? "transform 0.72s cubic-bezier(0.4,0,0.2,1)" : "none",
        }}
      >
        {/* Icon */}
        <div style={{
          width:"80px", height:"80px", borderRadius:"20px",
          background:"linear-gradient(135deg,#f97316 0%,#dc2626 100%)",
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0,
          animation: isExiting
            ? "none"
            : "sp-icon-in 0.7s 0.1s cubic-bezier(0.34,1.56,0.64,1) both, sp-glow 2.5s 0.8s ease-in-out infinite",
        }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="white">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm9 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM6 6h12v5H6V6z"/>
          </svg>
        </div>

        {/* Text */}
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          <div style={{
            display:"flex", alignItems:"baseline", gap:"10px",
            fontSize:"clamp(30px,5.5vw,50px)", fontWeight:900,
            fontFamily:"system-ui,-apple-system,sans-serif",
            letterSpacing:"-0.5px", lineHeight:1, whiteSpace:"nowrap",
          }}>
            <span style={{
              color:"#fff",
              animation: isExiting ? "none" : "sp-raj 0.55s 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
            }}>Raj</span>

            <span style={{
              background:"linear-gradient(90deg,#f97316 0%,#fbbf24 30%,#fff 50%,#fbbf24 70%,#f97316 100%)",
              backgroundSize:"300% auto",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              animation: isExiting
                ? "sp-shimmer 3s linear infinite"
                : "sp-mudra 0.65s 0.55s cubic-bezier(0.34,1.56,0.64,1) both, sp-shimmer 3s 1.2s linear infinite",
            }}>Mudra</span>

            <span style={{
              color:"#fff",
              animation: isExiting ? "none" : "sp-travels 0.55s 0.75s cubic-bezier(0.34,1.56,0.64,1) both",
            }}>Travels</span>
          </div>

          <div style={{
            fontSize:"clamp(9px,1.3vw,12px)", color:"rgba(255,255,255,0.4)",
            fontWeight:700, letterSpacing:"4px", textTransform:"uppercase",
            fontFamily:"system-ui,sans-serif",
            animation: isExiting ? "none" : "sp-tag 0.6s 1.0s cubic-bezier(0.4,0,0.2,1) both",
            opacity: isExiting ? 0 : undefined,
            transition: isExiting ? "opacity 0.2s ease" : "none",
          }}>
            India's Fastest Booking Platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
