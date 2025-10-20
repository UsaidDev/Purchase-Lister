import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  // Check user login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <nav className="navbar_container d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
      {/* Left Side: Logo + Name */}
      <div className="nav-left d-flex align-items-center gap-2">
        <i className="fa-solid fa-cart-shopping fs-5"></i>
        <span className="site-name fw-semibold">Purchase Lister</span>
      </div>

      {/* Right Side: Auth / User Info */}
      <div className="nav-right d-flex align-items-center gap-3">
        {user ? (
          // ✅ Show username when logged in
          <div className="d-flex align-items-center gap-2">
            <FaUserCircle className="fs-4" />
            <span className="fw-semibold">{user.displayName || "User"}</span>
          </div>
        ) : (
          // 🚪 Show login/signup buttons when not logged in
          <>
            <Link
              to="/login"
              className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-semibold"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-dark btn-sm rounded-pill px-3 fw-semibold"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
