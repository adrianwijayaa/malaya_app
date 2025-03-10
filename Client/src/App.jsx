import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
      </Routes>
      {!isAdminRoute && <Footer onBookNowClick={handleBookNowClick} />}
      <Form isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
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

  return <Router>{loading ? <Loading /> : <AppContent />}</Router>;
}

export default App;
