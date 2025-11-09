import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login state
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      console.log('Inside logout handle')
      const token = localStorage.getItem("token");
      if (token) {
        await API.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-2xl font-bold text-orange-600">
          AstroConnect
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-orange-500 transition-colors">
            Home
          </Link>
          <Link to="/pandits" className="text-gray-700 hover:text-orange-500 transition-colors">
            Pandits
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-orange-500 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-orange-500 transition-colors">
            Contact
          </Link>
        </div>

        {/* ✅ Conditional Button */}
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
