import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/LandingPage/Home.jsx";
import Pandits from "./pages/LandingPage/Pandits.jsx";
import UserRoutes from "./routes/userRoutes.jsx";
import PanditRoutes from "./routes/panditRoutes.jsx";
import AdminRoutes from "./routes/adminRoutes.jsx";

import { isTokenExpired, logout } from "./utils/auth";

export default function App() {
  useEffect(() => {
    /* =============================
       🔒 SESSION EXPIRY CHECKER
    ============================== */
    const checkSessionExpiry = () => {
      const token = localStorage.getItem("token");

      if (!token) return; // Not logged in

      if (isTokenExpired()) {
        alert("Your session has expired. Please log in again.");
        logout();
      }
    };

    // Check every minute
    const expiryInterval = setInterval(checkSessionExpiry, 60 * 1000);

    /* =============================
       💤 INACTIVITY LOGOUT CHECKER
    ============================== */
    let inactivityTimer;

    const resetInactivityTimer = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      clearTimeout(inactivityTimer);

      inactivityTimer = setTimeout(() => {
        alert("You've been inactive too long. Logging out...");
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    resetInactivityTimer(); // Start immediately

    return () => {
      clearInterval(expiryInterval);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Redirect global login/register to user defaults */}
        <Route path="/login" element={<Navigate to="/user/login" replace />} />
        <Route path="/register" element={<Navigate to="/user/register" replace />} />

        <Route path="/pandits" element={<Pandits />} />

        {/* Role routes */}
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/pandit/*" element={<PanditRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Catch-all */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
