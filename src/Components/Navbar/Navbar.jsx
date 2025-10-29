import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged ,signOut} from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  
  const handleLogout=()=>{
    console.log("Logout Successfully completed")
    signOut(auth)
    navigate('/')
  }
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <nav className="navbar_container d-flex justify-content-between align-items-center px-3 px-md-4 py-2 shadow-sm">
      {/* Left Side: Logo + Site Name */}
      <div className="nav-left d-flex align-items-center gap-2">
        <i className="fa-solid fa-cart-shopping fs-5"></i>
        <span className="site-name fw-semibold fs-6 fs-md-5">Purchase Lister</span>
      </div>

      {/* Right Side: Auth Section */}
      <div className="nav-right d-flex align-items-center gap-2 gap-md-3">
        {user ? (
          <div className="d-flex align-items-center gap-2">
            <FaUserCircle className="fs-4" />
            <span className="fw-semibold small">{user.displayName || "User"}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-outline-dark btn-sm rounded-pill px-2 px-md-3 py-1 fw-semibold"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-dark btn-sm rounded-pill px-2 px-md-3 py-1 fw-semibold"
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
