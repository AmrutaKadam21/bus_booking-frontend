import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "leaflet/dist/leaflet.css";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// ── Session expiry on browser close ──────────────────────────────────────────
// sessionStorage is cleared when the browser tab/window is closed.
// If sessionActive is not set, the user closed the browser → clear auth data.
if (!sessionStorage.getItem("sessionActive")) {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("loginTime");
}
// Mark this session as active (survives page refresh, cleared on tab close)
sessionStorage.setItem("sessionActive", "1");
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById('root')).render(
       <BrowserRouter>
              <App />
       </BrowserRouter>
)
