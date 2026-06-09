// src/components/Navbar.jsx
import React, { useState } from "react";
import { useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import Logo from "../assets/logo.png";

import useAuth from "../hooks/useAuth";
import "./navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
  return (
    <header className="navbar-wrapper">
      <nav className="container d-flex align-items-center justify-content-between py-3">

        {/* BRAND */}
        <Link to="/" className="brand">
          <div className="brand-logo">
            {/* <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 
              2 12.28 2 8.5 2 5.42 4.42 
              3 7.5 3c1.74 0 3.41.81 
              4.5 2.09C13.09 3.81 
              14.76 3 16.5 3 
              19.58 3 22 5.42 
              22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z" />
            </svg> */}
           <img
  src={Logo}
  alt="CareSync Logo"
  style={{
    width: "80px",
    height: "50px",
    objectFit: "contain"
  }}
/>
          </div>
          <span className="brand-title">CareSync</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="d-none d-md-flex gap-4">
          <NavLink to="/" className="navlink">Home</NavLink>
          <NavLink to="/doctors" className="navlink">Doctors</NavLink>
          <NavLink to="/pharmacies" className="navlink">Pharmacies</NavLink>
          <NavLink to="/nurses" className="navlink">Nurses</NavLink>
          <NavLink to="/dashboard" className="navlink">Dashboard</NavLink>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="d-flex align-items-center gap-3">

          {user ? (
            <>
            <div className="position-relative" ref={dropdownRef}>
  <div
    className="d-none d-md-flex align-items-center gap-2"
    style={{ cursor: "pointer" }}
    onClick={() => setDropdownOpen(!dropdownOpen)}
  >
    <FaUserCircle size={26} color="#6b7280" />
    <span style={{ fontWeight: 600 }}>{user.name}</span>
  </div>

  {dropdownOpen && (
    <div className="dropdown-menu-custom">
      <button
        className="dropdown-item"
        onClick={() => {
          navigate("/profile");
          setDropdownOpen(false);
        }}
      >
        Profile
      </button>
    </div>
  )}
</div>

              <button
                onClick={handleLogout}
                style={{
                  background: "#fee2e2",
                  color: "#b91c1c",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer"
                }}
              >
                <FaSignOutAlt size={14} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                padding: "8px 22px",
                background: "#0F172A",
                color: "#fff",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none"
              }}
            >
              Login
            </Link>
          )}

          {/* MOBILE TOGGLE */}
          <button
            className="d-md-none"
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none" }}
          >
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu d-md-none">
          <NavLink to="/" onClick={() => setOpen(false)} className="m-link">Home</NavLink>
          <NavLink to="/doctors" onClick={() => setOpen(false)} className="m-link">Doctors</NavLink>
          <NavLink to="/pharmacies" onClick={() => setOpen(false)} className="m-link">Pharmacies</NavLink>
       <NavLink to="/nurses" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "m-link active" : "m-link")}>
  Nurses
</NavLink>
          <NavLink to="/dashboard" onClick={() => setOpen(false)} className="m-link">Dashboard</NavLink>

          <div className="p-3">
            {user ? (
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px"
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px",
                  background: "#0F172A",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none"
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
