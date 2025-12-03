import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [userInitial, setUserInitial] = useState("U");
  const navigate = useNavigate();

  /* ---------------------------------------------------
     🔥 HANDLE SCROLL
  --------------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------------------------------------------------
     🔥 CHECK LOGIN + DECODE TOKEN
  --------------------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setRole(null);
      setUserInitial("U");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const currentRole = decoded.role;

      setIsLoggedIn(true);
      setRole(currentRole);

      let storedName = "";

      if (currentRole === "user") {
        storedName = localStorage.getItem("userName");
      } else if (currentRole === "pandit") {
        storedName = localStorage.getItem("panditName");
      } else if (currentRole === "admin") {
        storedName = localStorage.getItem("adminName");
      }

      if (storedName) {
        setUserInitial(storedName.charAt(0).toUpperCase());
      } else {
        setUserInitial("U");
      }
    } catch (err) {
      console.error("Token decode failed:", err);
      setUserInitial("U");
    }
  }, []);

  /* ---------------------------------------------------
     🔥 LOGOUT
  --------------------------------------------------- */
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  /* ---------------------------------------------------
     🔥 RENDER ROLE-BASED MENUS
  --------------------------------------------------- */
  const renderMenu = () => {
    if (!isLoggedIn) {
      return <Link to="/login" className="nav-btn">Login</Link>;
    }

    return (
      <div className="user-menu">
        <div className="profile-circle">{userInitial}</div>
        <div className="dropdown">
          {role === "user" && (
            <>
              <Link to="/user/home">Dashboard</Link>
              <Link to="/user/wallet">Wallet</Link>
              <Link to="/user/history">History</Link>
            </>
          )}

          {role === "pandit" && (
            <>
              <Link to="/pandit/dashboard">Dashboard</Link>
              <Link to="/pandit/chat">Chats</Link>
              <Link to="/pandit/wallet">Wallet</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/pandit">Manage Pandits</Link>
            </>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------
     🔥 NAVBAR UI
  --------------------------------------------------- */
  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">

        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} className="logo-img" alt="AstroOracle Logo" />
          <span className="logo-text">AstroOracle</span>
        </div>

        {/* Links */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/pandits">Pandits</Link>
          <Link to="/horoscope">Horoscope</Link>
          <Link to="/contact">Contact</Link>

          {renderMenu()}
        </nav>

        {/* Mobile */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
