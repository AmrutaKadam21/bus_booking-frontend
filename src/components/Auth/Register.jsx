import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../config/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/auth/register`, form);

      // Do NOT auto-login — redirect to login page instead
      // Clear any token that backend may have returned
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("loginTime");

      setSuccess(res.data.message || "Registration successful! Redirecting to login...");
      setForm({ name: "", phone: "", email: "", password: "" });

      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",     label: "Full Name",    type: "text",     placeholder: "Enter your full name" },
    { name: "phone",    label: "Phone (optional)", type: "tel",  placeholder: "10-digit mobile number" },
    { name: "email",    label: "Email",         type: "email",    placeholder: "you@example.com" },
    { name: "password", label: "Password",      type: "password", placeholder: "Min. 6 characters" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">

      {/* Glows */}
      <div className="absolute w-96 h-96 bg-orange-500/20 blur-3xl rounded-full -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-orange-400/20 blur-3xl rounded-full -bottom-20 -right-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join and start your journey 🚍</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/20 border border-green-400/30 text-green-300 text-sm text-center">
            {success}
          </div>
        )}

        {/* Fields */}
        <div className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-300">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-lg hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-1"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
            ) : "Register"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-orange-400 font-semibold cursor-pointer hover:text-orange-300 transition">
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;
