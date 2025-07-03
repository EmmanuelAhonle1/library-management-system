import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormatValidator from "../utils/FormatValidator";
import "./Login.css";

const Login = ({ userType }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!FormatValidator.validateRequired(formData.email)) {
      newErrors.email = "Email is required";
    } else if (!FormatValidator.validateEmail(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!FormatValidator.validateRequired(formData.password)) {
      newErrors.password = "Password is required";
    } else if (!FormatValidator.validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // TODO: Replace with actual API call
    console.log(`${userType} login attempt:`, formData);

    // Dummy success - redirect to dashboard
    navigate("/dashboard");
  };

  const handleSignupRedirect = () => {
    navigate(`/signup-${userType.toLowerCase()}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{userType} Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="login-btn">
            Login as {userType}
          </button>
        </form>

        <div className="signup-link">
          <p>Don't have an account?</p>
          <button
            onClick={handleSignupRedirect}
            className="signup-redirect-btn"
          >
            Sign up as {userType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
