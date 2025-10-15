import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <div>
      <nav class="navbar_container">
        <div class="nav-left">
          <i class="fa-solid fa-cart-shopping"></i>
          <span class="site-name">Purchase Lister</span>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
