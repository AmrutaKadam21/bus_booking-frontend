import React, { useState, useEffect } from "react";
import { FaBusSimple } from "react-icons/fa6";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ── Shared logout helper — call this from ANY component ──
export const doLogout = (navigate) => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("loginTime");
  sessionStorage.removeItem("sessionActive");
  window.dispatchEvent(new Event("authChange"));
  if (navigate) navigate("/");
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });
  const navigate = useNavigate();

  // ── Listen to authChange (same tab) AND storage (other tabs) ──
  useEffect(() => {
    const sync = () => {
      const s = localStorage.getItem("user");
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("authChange", sync);   // same-tab logout/login
    window.addEventListener("storage",    sync);   // other-tab changes
    return () => {
      window.removeEventListener("authChange", sync);
      window.removeEventListener("storage",    sync);
    };
  }, []);

  // ── Close dropdown on outside click ──
  const handleLogout = () => {
    setOpen(false);
    doLogout(navigate);
  };

  const navLinks = [
    { label: "Home",     path: "/" },
    { label: "About",    path: "/About" },
    { label: "Services", path: "/Service" },
    { label: "Contact",  path: "/Contact" },
  ];

  return (
    <header className="bg-black text-white w-full sticky top-0 z-50 border-b border-white/5">
      <div className="flex items-center justify-between h-20 px-4 md:px-8 lg:px-14 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <FaBusSimple className="text-white text-sm" />
          </div>
          <h2 className="text-sm md:text-lg lg:text-xl font-black tracking-tight">
            Raj<span className="text-orange-400"> Mudra </span>Travels
          </h2>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6 md:gap-8">
          {navLinks.map((link) => (
            <button key={link.path} onClick={() => navigate(link.path)}
              className="text-sm font-semibold text-white/70 hover:text-orange-400 transition-colors duration-200 relative group">
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-400 rounded-full group-hover:w-full transition-all duration-300" />
            </button>
          ))}

          {/* Auth */}
          {user ? (
            <button onClick={() => navigate(user?.role === "admin" ? "/admin-dashboard" : "/dashboard")} className="flex items-center gap-2 group">
              <img
                src="https://cdn4.vectorstock.com/i/1000x1000/66/13/default-avatar-profile-icon-social-media-user-vector-49816613.jpg"
                alt="profile"
                className="w-10 h-10 rounded-full border-2 border-orange-400 object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-xs text-white/50 font-semibold hidden md:block">
                {user?.name || "My Account"}
              </span>
            </button>
          ) : (
            <button onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-black px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
              Register
            </button>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button className="sm:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen((v) => !v)}>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 border-t border-white/10" : "max-h-0"}`}>
        <div className="bg-gray-950 px-5 py-4 space-y-1">
          {navLinks.map((link) => (
            <button key={link.path} onClick={() => { navigate(link.path); setOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-white/70 hover:text-orange-400 hover:bg-white/5 rounded-xl transition-all duration-200">
              {link.label}
            </button>
          ))}
          <div className="border-t border-white/10 pt-3 mt-2">
            {user ? (
              <div className="space-y-1">
                <button onClick={() => { navigate(user?.role === "admin" ? "/admin-dashboard" : "/dashboard"); setOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-white/70 hover:text-orange-400 hover:bg-white/5 rounded-xl transition-all duration-200">
                  <FaUser className="text-orange-400 text-xs" /> My Profile
                </button>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                  <FaSignOutAlt className="text-xs" /> Logout
                </button>
              </div>
            ) : (
              <button onClick={() => { navigate("/register"); setOpen(false); }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-black px-4 py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all duration-200">
                Register / Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
