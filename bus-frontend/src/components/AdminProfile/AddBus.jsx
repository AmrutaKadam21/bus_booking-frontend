import React, { useState, useRef } from "react";
import bgImage from "../../assets/Images/bg3.png";
import axios from "axios";

export default function AddBus() {

  const [mode, setMode] = useState("form");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    busName: "",
    busNumber: "",
    busType: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    travelDurationMins: "",
    price: "",
    seats: "",
    rating: "",
    amenities: "",
    boardingPoints: "",
    droppingPoints: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/buses/add", {
        ...form,
        price:              Number(form.price),
        seats:              Number(form.seats),
        travelDurationMins: form.travelDurationMins ? Number(form.travelDurationMins) : undefined,
        rating:             form.rating ? Number(form.rating) : undefined,
        amenities:          form.amenities ? form.amenities.split(",").map(s => s.trim()).filter(Boolean) : [],
        boardingPoints:     form.boardingPoints ? form.boardingPoints.split(",").map(s => s.trim()).filter(Boolean) : [],
        droppingPoints:     form.droppingPoints ? form.droppingPoints.split(",").map(s => s.trim()).filter(Boolean) : [],
      });

      alert("Bus Added Successfully 🚍");

      setForm({
        busName: "", busNumber: "", busType: "",
        from: "", to: "",
        departureTime: "", arrivalTime: "", travelDurationMins: "",
        price: "", seats: "", rating: "",
        amenities: "", boardingPoints: "", droppingPoints: "",
      });
    } catch (err) {
      console.error("FULL ERROR:", err);
      alert(err?.response?.data?.error || "Error adding bus");
    }
  };

  // ✅ CSV UPLOAD
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/api/buses/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("CSV Uploaded Successfully 🚀");
      setFile(null);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("CSV Upload Error:", err);
      alert(err?.response?.data?.error || "Upload Failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-shadow overflow-hidden">

        {/* HEADER */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Bus Management</h2>
          <p className="text-gray-500 text-sm">Add bus or upload CSV</p>
        </div>

        {/* 🔥 TOGGLE BUTTON */}
        <div className="flex gap-2 p-4">
          <button
            type="button"
            onClick={() => setMode("form")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mode === "form"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Add Bus
          </button>

          <button
            type="button"
            onClick={() => setMode("csv")}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mode === "csv"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Upload CSV
          </button>
        </div>

        {/* ================= FORM ================= */}
        {mode === "form" && (
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="label">Bus Name</label>
              <input name="busName" value={form.busName} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Bus Number</label>
              <input name="busNumber" value={form.busNumber} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Bus Type</label>
              <select name="busType" value={form.busType} onChange={handleChange} className="input">
                <option value="">Select Type</option>
                <option>AC Sleeper</option>
                <option>Non-AC Sleeper</option>
                <option>AC Seater</option>
                <option>Non-AC Seater</option>
                <option>Volvo</option>
              </select>
            </div>

            <div>
              <label className="label">From</label>
              <input name="from" value={form.from} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">To</label>
              <input name="to" value={form.to} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Departure Time</label>
              <input type="time" name="departureTime" value={form.departureTime} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Arrival Time</label>
              <input type="time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Travel Duration (mins)</label>
              <input type="number" name="travelDurationMins" value={form.travelDurationMins} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Price (₹)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Seats</label>
              <input type="number" name="seats" value={form.seats} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="label">Rating (0-5)</label>
              <input type="number" step="0.1" min="0" max="5" name="rating" value={form.rating} onChange={handleChange} className="input" />
            </div>

            <div className="md:col-span-2">
              <label className="label">Amenities (comma separated)</label>
              <input name="amenities" value={form.amenities} onChange={handleChange} placeholder="WiFi, AC, Charging Point" className="input" />
            </div>

            <div className="md:col-span-2">
              <label className="label">Boarding Points (comma separated)</label>
              <input name="boardingPoints" value={form.boardingPoints} onChange={handleChange} placeholder="Swargate, Shivajinagar" className="input" />
            </div>

            <div className="md:col-span-2">
              <label className="label">Dropping Points (comma separated)</label>
              <input name="droppingPoints" value={form.droppingPoints} onChange={handleChange} placeholder="Dadar, Borivali" className="input" />
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300">
                Add Bus
              </button>
            </div>

          </form>
        )}

        {/* ================= CSV ================= */}
        {mode === "csv" && (
          <div className="p-6 flex flex-col items-center gap-4">

            <label className="w-full border-2 border-dashed border-orange-300 rounded-xl p-8 text-center cursor-pointer hover:bg-orange-50 transition">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files[0];
                  if (selected) {
                    setFile(selected);
                    setFileName(selected.name);
                  }
                }}
              />
              <p className="text-orange-500 font-semibold text-lg">
                {fileName ? `✅ ${fileName}` : "Click to select CSV file"}
              </p>
              <p className="text-gray-400 text-sm mt-1">Only .csv files accepted</p>
            </label>

            <button
              onClick={handleUpload}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold w-full"
            >
              Upload CSV
            </button>

          </div>
        )}

      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          transition: all 0.2s ease;
        }
        .input:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249,115,22,0.2);
        }
        .label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #374151;
        }
      `}</style>
    </div>
  );
}