import React, { useRef, useEffect } from "react";
import { HiOutlineLightBulb, HiOutlineBadgeCheck } from "react-icons/hi";
import bus_img2 from "../../assets/Images/bus_img2.jpg";
const Aboutbuscompany = () => {
  const bannerRef  = useRef(null);
  const contentRef = useRef(null);

  // Parallax on the banner image
  useEffect(() => {
    const onScroll = () => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const offset = -rect.top;
      bannerRef.current.querySelector(".about-parallax-bg").style.transform =
        `translateY(${offset * 0.38}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-reveal content
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal-child").forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (contentRef.current) observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Parallax Banner Strip ── */}
      <div ref={bannerRef} className="relative h-80 md:h-[420px] overflow-hidden">
        <div
          className="about-parallax-bg absolute inset-0 w-full bg-center bg-cover bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url(${bus_img2})`,
            height: "150%",
            top: "-25%",
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />
        {/* Banner text */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-orange-300 text-xs font-black tracking-[0.3em] uppercase mb-3">
            Our Story
          </p>
          <h2
            className="text-white font-black uppercase leading-tight"
            style={{ fontSize: "clamp(1.6rem, 4vw, 3.2rem)" }}
          >
            About{" "}
            <span className="shimmer-text">Raj Mudra</span>
          </h2>
        </div>
      </div>

      {/* ── Content Section ── */}
      <section
        ref={contentRef}
        className="relative overflow-hidden py-20 px-4 md:px-10 lg:px-20 bg-white"
      >
        {/* Subtle bg pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-6">
              <div className="reveal-child">
                <h3 className="text-2xl font-black text-slate-800 mb-4">
                  Revolutionizing Your Journey
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Founded with a vision to revolutionize bus travel,{" "}
                  <span className="font-bold text-slate-900">Raj Mudra Travels</span> has been
                  connecting people to their destinations for years. What started as a small fleet
                  serving local routes has grown into a trusted name in passenger transportation.
                </p>
              </div>
              <p className="text-slate-500 leading-relaxed reveal-child">
                We've built our reputation on reliability, safety, and exceptional customer service,
                making every journey a testament to our commitment to excellence.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 reveal-child">
                <div
                  className="pl-4 py-2"
                  style={{ borderLeft: "4px solid #f97316" }}
                >
                  <h4 className="text-xl font-black text-slate-900">Reliability</h4>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">
                    Guaranteed Service
                  </p>
                </div>
                <div
                  className="pl-4 py-2"
                  style={{ borderLeft: "4px solid #3b82f6" }}
                >
                  <h4 className="text-xl font-black text-slate-900">Safety</h4>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">
                    First Priority
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Mission & Vision */}
            <div className="grid gap-6">
              <div
                className="group reveal-child p-8 rounded-3xl border transition-all duration-400 hover:-translate-y-2 hover:shadow-xl"
                style={{ borderColor: "rgba(249,115,22,0.2)", background: "rgba(255,247,237,0.6)" }}
              >
                <HiOutlineLightBulb className="text-4xl text-orange-500 mb-4 group-hover:rotate-12 transition-transform duration-300" />
                <h4 className="text-xl font-black text-slate-800 mb-2">Our Mission</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  To provide world-class transportation that combines luxury, punctuality, and safety,
                  making high-end travel accessible to everyone.
                </p>
              </div>

              <div
                className="group reveal-child p-8 rounded-3xl border transition-all duration-400 hover:-translate-y-2 hover:shadow-xl"
                style={{ borderColor: "rgba(59,130,246,0.2)", background: "rgba(239,246,255,0.6)" }}
              >
                <HiOutlineBadgeCheck className="text-4xl text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-xl font-black text-slate-900 mb-2">Our Vision</h4>
                <p className="text-slate-500 leading-relaxed text-sm">
                  To become India's most preferred travel partner by setting new benchmarks in
                  hospitality and road safety standards.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Aboutbuscompany;
