import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaShoppingCart,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/firebase";

const Signup = () => {
  const navigate = useNavigate();
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user display name
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      console.log("User Created:", userCredential.user);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light px-3 px-sm-0">
      <div
        className="card shadow p-4 rounded-4 w-100"
        style={{ maxWidth: "380px" }}
      >
        {/* Header */}
        <div className="text-center mb-3">
          <div className="bg-light rounded-circle d-inline-flex p-3 mb-2">
            <FaShoppingCart size={28} />
          </div>
          <h5 className="fw-semibold mb-1 fs-5 fs-md-4">Create Account</h5>
          <p className="text-secondary small mb-3 text-center">
            Sign up to start managing your purchases efficiently
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaUser />
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-control shadow-none border-start-0"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <FaEnvelope />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control shadow-none border-start-0"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirm Password */}
          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold small">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Terms */}
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="terms" />
            <label
              className="form-check-label small text-secondary"
              htmlFor="terms"
            >
              I agree to the{" "}
              <Link to="/terms" className="fw-semibold text-decoration-none">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="fw-semibold text-decoration-none">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            className="btn btn-dark w-100 rounded-3 py-2 fw-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Sign In Link */}
        <p className="text-center mt-3 small text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-decoration-none">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;