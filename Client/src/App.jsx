import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbars from "./components/Navbars";
import Home from "./components/home/Home";
import Loading from "./components/loading/Loading";
import Admin from "./components/admin/Admin";
import AboutUs from "./components/about-us/AboutUs";
import Footer from "./components/Footer";
import Form from "./components/form/Form";
import AdminAuth from "./components/admin/AdminAuth";
import TailorMadePage from "./pages/TailormadePage";
import TailormadeDetail from "./pages/TailormadeDetail";
import JoinDeTrip from "./pages/JoinDeTrip";
import JoinDeTripDetail from "./pages/JoinDeTripDetail";
import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";

const AppContent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleBookNowClick = (e) => {
    e.preventDefault();
    setIsFormOpen(true);
  };

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ReactLenis
        root
        options={{
          // INTI
          smoothWheel: true, // haluskan scroll mouse/trackpad
          smoothTouch: false, // biarkan mobile natural (lebih aman UX)
          duration: 1.05, // 0.95–1.2; 1.05 = balance (pakai duration ATAU lerp)
          // lerp: 0.08,               // alternatif kalau pilih lerp (hapus duration)

          // RASA & PERILAKU
          easing: (t) => 1 - (1 - t) ** 2, // easeOutQuad yang ringan
          anchors: true, // <a href="#id"> auto-smooth
          gestureOrientation: "vertical",
          wheelMultiplier: 1, // 0.9–1.1; naikkan kalau mau lebih “ngelos”
        }}
      >
        {!isAdminRoute && <Navbars />}
        <Routes>
          <Route
            path="/"
            element={<Home onBookNowClick={handleBookNowClick} />}
          />
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/open-trip" element={<TailorMadePage />} />
          <Route path="/open-trip/:slug" element={<TailormadeDetail />} />
          <Route path="/signature-journey" element={<JoinDeTrip />} />
          <Route
            path="/signature-journey/:tripId"
            element={<JoinDeTripDetail />}
          />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
        </Routes>
        {!isAdminRoute && <Footer onBookNowClick={handleBookNowClick} />}
        <Form isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </ReactLenis>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminAuth") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }
  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <Router>
      {loading ? <Loading /> : <AppContent />}
      <ToastContainer position="top-right" autoClose={2500} />
    </Router>
  );
}

export default App;
