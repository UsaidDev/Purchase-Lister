import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Firebase/firebase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User Logged In:", userCredential.user);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light px-3 px-sm-0">
      <div className="card shadow p-4 rounded-4 w-100" style={{ maxWidth: "380px" }}>
        {/* Header */}
        <div className="text-center mb-3">
          <div className="bg-light rounded-circle d-inline-flex p-3 mb-2">
            <FaShoppingCart size={28} />
          </div>
          <h5 className="fw-semibold mb-1 fs-5 fs-md-4">Welcome Back</h5>
          <p className="text-secondary small mb-3 text-center">
            Sign in to your account to continue managing your purchases
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control shadow-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control shadow-none"
              placeholder="Enter your password"
              required
            />
            <span
              className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
              role="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Remember + Forgot */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label small text-secondary" htmlFor="remember">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot"
              className="small fw-semibold text-decoration-none mt-2 mt-sm-0"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-dark w-100 rounded-3 py-2 fw-semibold">
            Sign In
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center mt-3 small text-secondary">
          Don’t have an account?{" "}
          <Link to="/signup" className="fw-semibold text-decoration-none">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;