import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import AppRoutes from "./Routes/AppRoutes";
import SplashScreen from "./components/Layout/SplashScreen";

const NO_FOOTER_ROUTES = [
  "/dashboard", "/bookings", "/tickets",
  "/cancellations", "/livetracking", "/admin-dashboard",
];

// Show splash only once per browser session
const hasSeenSplash = sessionStorage.getItem("splashSeen");

function App() {
  const location = useLocation();
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname);
  const [splashDone, setSplashDone] = useState(!!hasSeenSplash);

  const handleSplashDone = () => {
    sessionStorage.setItem("splashSeen", "1");
    setSplashDone(true);
  };

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      {/* App fades in smoothly once splash is done */}
      <div
        style={{
          opacity: splashDone ? 1 : 0,
          transition: splashDone ? "opacity 0.6s ease" : "none",
          visibility: splashDone ? "visible" : "hidden",
        }}
      >
        <Header />
        <AppRoutes />
        {showFooter && <Footer />}
      </div>
    </>
  );
}

export default App;
