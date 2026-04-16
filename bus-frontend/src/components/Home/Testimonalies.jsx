import { useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    img: "https://i.pinimg.com/736x/2e/f8/39/2ef83928873282d968e9f6c497df8c37.jpg",
    name: "Ethan Walker",
    role: "Verified Traveler",
    rating: 5,
    desc: "The Raj Mudra Travelers provided an exceptional travel experience. The bus was clean and comfortable, the staff were friendly and professional.",
  },
  {
    img: "https://i.pinimg.com/1200x/a4/ad/e3/a4ade34601af89c976de99b6c1cb42a5.jpg",
    name: "Liam Anderson",
    role: "Regular Commuter",
    rating: 5,
    desc: "Exceptional service! The punctuality of Raj Mudra is what keeps me coming back. Best premium bus service in the city by far.",
  },
  {
    img: "https://i.pinimg.com/736x/2e/f8/39/2ef83928873282d968e9f6c497df8c37.jpg",
    name: "Noah Thompson",
    role: "Business Traveler",
    rating: 4,
    desc: "Cleanliness and comfort are my top priorities, and Raj Mudra delivers both perfectly. The staff goes above and beyond for passengers.",
  },
  {
    img: "https://i.pinimg.com/736x/94/84/53/948453da7013aa0adab11e82b3237057.jpg",
    name: "Oliver Harris",
    role: "Verified Traveler",
    rating: 5,
    desc: "A truly hassle-free experience. From booking to drop-off, everything was seamless. Highly recommended for long distance travel.",
  },
];

const styles = `
@keyframes cardEnter {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
@keyframes shimmer {
  0%   { left: -100%; }
  100% { left: 200%; }
}
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.tcard-wrap {
  animation: cardEnter 0.6s ease both;
  perspective: 800px;
}
.tcard-wrap:hover {
  animation: none;
}
`;

const TestimonialCard = ({ test, i }) => {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x:  ((e.clientY - r.top)  / r.height - 0.5) * 14,
      y: -((e.clientX - r.left) / r.width  - 0.5) * 14,
    });
  };

  return (
    <div
      className="tcard-wrap"
      style={{ animationDelay: `${i * 0.15}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={onMove}
    >
      {/* Animated gradient border */}
      <div
        style={{
          padding: "2px",
          borderRadius: "1.75rem",
          background: hovered
            ? "linear-gradient(135deg,#f97316,#dc2626,#7c3aed,#f97316)"
            : "linear-gradient(135deg,#fed7aa,#fecaca)",
          backgroundSize: "300% 300%",
          animation: hovered ? "gradientShift 2s ease infinite" : "none",
          boxShadow: hovered
            ? "0 20px 60px rgba(249,115,22,0.35)"
            : "0 4px 24px rgba(0,0,0,0.07)",
          transition: "box-shadow 0.4s ease",
        }}
      >
        {/* Card body */}
        <div
          className="relative overflow-hidden flex flex-col"
          style={{
            background: hovered
              ? "linear-gradient(145deg,#1e1b4b,#1f2937 60%,#111827)"
              : "#ffffff",
            borderRadius: "calc(1.75rem - 2px)",
            padding: "2rem",
            transform: hovered
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
              : "rotateX(0) rotateY(0)",
            transition: "transform 0.15s ease, background 0.4s ease",
            animation: hovered ? "none" : `floatCard 4s ease-in-out ${i * 0.6}s infinite`,
          }}
        >
          {/* Shimmer */}
          {hovered && (
            <div
              style={{
                position: "absolute", top: 0, width: "60%", height: "100%",
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)",
                animation: "shimmer 1.4s ease infinite",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Top accent bar */}
          <div
            style={{
              position: "absolute", top: 0, left: "10%", width: "80%", height: "3px",
              borderRadius: "0 0 4px 4px",
              background: hovered
                ? "linear-gradient(90deg,#f97316,#dc2626)"
                : "linear-gradient(90deg,#fed7aa,#fecaca)",
              transition: "background 0.4s ease",
            }}
          />

          <FaQuoteLeft
            style={{
              fontSize: "2rem", marginBottom: "1rem",
              color: hovered ? "#f97316" : "#fed7aa",
              transform: hovered ? "scale(1.2) rotate(-5deg)" : "scale(1)",
              transition: "color 0.3s ease, transform 0.3s ease",
            }}
          />

          {/* Stars */}
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, s) => (
              <FaStar key={s} style={{
                fontSize: "0.75rem",
                color: s < test.rating ? "#f97316" : hovered ? "#374151" : "#e2e8f0",
                transition: `color 0.2s ease ${s * 0.05}s`,
              }} />
            ))}
          </div>

          <p style={{
            color: hovered ? "#d1d5db" : "#475569",
            fontSize: "0.875rem", lineHeight: "1.7",
            fontStyle: "italic", flexGrow: 1, marginBottom: "1.5rem",
            transition: "color 0.4s ease",
          }}>
            "{test.desc}"
          </p>

          {/* Divider */}
          <div style={{
            height: "1px", marginBottom: "1.25rem",
            background: hovered
              ? "linear-gradient(90deg,transparent,rgba(249,115,22,0.4),transparent)"
              : "linear-gradient(90deg,transparent,#e2e8f0,transparent)",
            transition: "background 0.4s ease",
          }} />

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div style={{
              padding: "2px", borderRadius: "50%", flexShrink: 0,
              background: hovered
                ? "linear-gradient(135deg,#f97316,#dc2626)"
                : "linear-gradient(135deg,#fed7aa,#fecaca)",
              transition: "background 0.4s ease",
            }}>
              <img src={test.img} alt={test.name} style={{
                width: "44px", height: "44px", borderRadius: "50%",
                objectFit: "cover", display: "block",
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transition: "transform 0.4s ease",
              }} />
            </div>

            <div>
              <h3 style={{
                fontSize: "0.875rem", fontWeight: 800, lineHeight: 1,
                color: hovered ? "#f9fafb" : "#0f172a",
                transition: "color 0.4s ease",
              }}>{test.name}</h3>
              <p style={{
                fontSize: "0.75rem", marginTop: "3px", fontWeight: 600,
                color: hovered ? "#f97316" : "#94a3b8",
                transition: "color 0.4s ease",
              }}>{test.role}</p>
            </div>

            {/* Verified badge */}
            <div style={{
              marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700,
              padding: "3px 8px", borderRadius: "999px",
              background: hovered ? "rgba(249,115,22,0.2)" : "rgba(249,115,22,0.08)",
              color: "#f97316", border: "1px solid rgba(249,115,22,0.3)",
              letterSpacing: "0.05em", transition: "background 0.4s ease",
            }}>✓ Verified</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonalies = () => (
  <>
    <style>{styles}</style>
    <section
      className="relative overflow-hidden py-24 px-4 md:px-10 lg:px-20"
      style={{ background: "radial-gradient(ellipse at top right,#fff7ed 0%,#f8fafc 45%,#eff6ff 100%)" }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle,#f97316 1px,transparent 1px)",
        backgroundSize: "30px 30px", opacity: 0.04,
      }} />

      {/* Blobs */}
      <div className="absolute pointer-events-none" style={{
        top: "-80px", right: "-80px", width: "320px", height: "320px",
        borderRadius: "50%",
        background: "radial-gradient(circle,rgba(249,115,22,0.12),transparent 70%)",
        filter: "blur(40px)",
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: "-60px", left: "-60px", width: "260px", height: "260px",
        borderRadius: "50%",
        background: "radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)",
        filter: "blur(40px)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.25em",
              textTransform: "uppercase", color: "#f97316",
              background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)",
              padding: "4px 14px", borderRadius: "999px", marginBottom: "12px",
            }}>✦ Passenger Stories</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Voices of Our{" "}
              <span style={{
                background: "linear-gradient(90deg,#f97316,#dc2626)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Passengers</span>
            </h2>
            <p className="text-slate-500 mt-3 text-base italic">
              Real stories from real travelers who choose Raj Mudra.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3" style={{
            background: "white", padding: "14px 24px", borderRadius: "1.25rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid rgba(249,115,22,0.15)",
          }}>
            <div>
              <span style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>4.8</span>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "4px" }}>/5</span>
            </div>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} style={{ color: "#f97316", fontSize: "0.9rem" }} />
                ))}
              </div>
              <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, marginTop: "2px" }}>
                Average Rating
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((test, i) => (
            <TestimonialCard key={i} test={test} i={i} />
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Testimonalies;
