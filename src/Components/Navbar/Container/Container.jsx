import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Container.css'

export default function Container(){
    return (
         <div className="container my-5">

        <div className="row g-4 ">
          {/* Left: Add Purchase Item */}
          <div className="col-12 col-md-6 col-lg-6">
            <div className="card border-0">
              <div className="card-body">
                <h5 className="card-title mb-4 fw-semibold">Add Purchase Item</h5>

                <form>
                  <div className="mb-4">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter item name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Item Image</label>
                    <div className="input-group">
                      <input type="file" className="form-control shadow-none"  />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Budget</label>
                    <input
                      type="number"
                      className="form-control shadow-none"
                      placeholder="Enter budget amount"
                    />
                  </div>

                  <button type="submit" className="btn btn-dark w-100">
                    Add Item
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Added Items List */}
          <div className="col-12 col-md-6 col-lg-6">
            <div className="h-100 d-flex justify-content-center align-items-center text-center p-5">
              <div>
                <h5 className="fw-semibold mb-3">Added Items List</h5>
                <p className="text-muted mb-4">0 items added</p>
                <div className="text-secondary mb-3" style={{ fontSize: "3rem" }}>
                  🛒
                </div>
                <p className="text-muted">
                  No items added yet. Start by adding your first purchase item!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
