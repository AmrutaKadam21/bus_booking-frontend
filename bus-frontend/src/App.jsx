import { useLocation } from "react-router-dom"
import Header from "./components/Layout/Header"
import Footer from "./components/Layout/Footer"
import AppRoutes from "./Routes/AppRoutes"

const NO_FOOTER_ROUTES = [
  "/dashboard", "/bookings", "/tickets",
  "/cancellations", "/livetracking", "/admin-dashboard",
];

function App() {
  const location = useLocation();
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname);

  return (
    <div>
      <Header />
      <AppRoutes />
      {showFooter && <Footer />}
    </div>
  );
}

export default App