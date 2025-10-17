import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4 rounded-4" style={{ width: "380px" }}>
        <div className="text-center mb-3">
          <div className="bg-light rounded-circle d-inline-flex p-3 mb-2">
            <FaShoppingCart size={28} />
          </div>
          <h5 className="fw-semibold mb-1">Welcome Back</h5>
          <p className="text-secondary small mb-3">
            Sign in to your account to continue managing your purchases
          </p>
        </div>

        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email</label>
            <input
              type="email"
              className="form-control shadow-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control shadow-none"
              placeholder="Enter your password"
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
              role="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label small text-secondary" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="#" className="small fw-semibold text-decoration-none">
              Forgot password?
            </a>
          </div>

          <button className="btn btn-dark w-100 rounded-3 py-2 fw-semibold">
            Sign In
          </button>
        </form>

        <p className="text-center mt-3 small text-secondary">
          Don’t have an account?{" "}
          <a href="#" className="fw-semibold text-decoration-none">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
