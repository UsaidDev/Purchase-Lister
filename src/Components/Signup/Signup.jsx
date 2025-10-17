import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaEye, FaEyeSlash, FaUser, FaEnvelope } from "react-icons/fa";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 rounded-4" style={{ width: "380px" }}>
        <div className="text-center mb-3">
          <div className="bg-light rounded-circle d-inline-flex p-3 mb-2">
            <FaShoppingCart size={28} />
          </div>
          <h5 className="fw-semibold mb-1">Create Account</h5>
          <p className="text-secondary small mb-3">
            Sign up to start managing your purchases efficiently
          </p>
        </div>
        
        <form>
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control shadow-none border-start-0"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control shadow-none border-start-0"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control shadow-none"
              placeholder="Create a password"
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
              role="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              className="form-control shadow-none"
              placeholder="Confirm your password"
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
              role="button"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="terms" />
            <label className="form-check-label small text-secondary" htmlFor="terms">
              I agree to the{" "}
              <a href="#" className="fw-semibold text-decoration-none">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="fw-semibold text-decoration-none">
                Privacy Policy
              </a>
            </label>
          </div>

          <button className="btn btn-dark w-100 rounded-3 py-2 fw-semibold">
            Create Account
          </button>
        </form>

        <p className="text-center mt-3 small text-secondary">
          Already have an account?{" "}
          <a href="#" className="fw-semibold text-decoration-none">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
