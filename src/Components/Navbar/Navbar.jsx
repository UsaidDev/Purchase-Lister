import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import '../Navbar/Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar bg-white shadow-sm px-3 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left: Logo & Title */}
        <div className="d-flex align-items-center gap-2">
          <FaShoppingCart size={20} />
          <span className="fw-semibold fs-5">Purchase Lister</span>
        </div>

        {/* Right: Username & Logout */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center text-secondary gap-1">
            <FaUser size={16} />
            <span className="fw-medium small">usaid</span>
          </div>
          <button className="btn btn-outline-secondary btn-sm fw-semibold rounded-3 px-3">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
