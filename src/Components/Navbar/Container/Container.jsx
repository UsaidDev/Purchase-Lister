import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Container() {
  return (
    <div>
      <div class="container mt-5">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-6 bg-primary text-white p-4">
            Column 1
          </div>
          <div class="col-12 col-md-6 col-lg-6 bg-secondary text-white p-4">
            Column 2
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container;
