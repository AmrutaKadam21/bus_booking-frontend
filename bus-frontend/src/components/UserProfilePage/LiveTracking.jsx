import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function LiveTracking() {
  const [busId, setBusId] = useState("");
  const [trackId, setTrackId] = useState(null);
  const [position, setPosition] = useState([18.5204, 73.8567]); // Pune default

  // ✅ Fetch location when tracking starts
  useEffect(() => {
    if (!trackId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/buses/location/${trackId}`
        );

        const { lat, lng } = res.data.location;

        if (lat && lng) {
          setPosition([lat, lng]);
        }

      } catch (err) {
        console.log(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [trackId]);

  return (
    <div className="p-6 space-y-6">

      {/* INPUT SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Live Bus Tracking 🚍</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Bus ID"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />

          <button
            onClick={() => setTrackId(busId)}
            className="px-5 py-2 bg-orange-500 text-white rounded-lg"
          >
            Track
          </button>
        </div>
      </div>

      {/* MAP */}
      <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg">
        <MapContainer center={position} zoom={12} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} />
        </MapContainer>
      </div>

    </div>
  );
}