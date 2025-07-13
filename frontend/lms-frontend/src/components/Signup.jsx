import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormatValidator from "../utils/FormatValidator";
import "./Signup.css";

// API configuration using Vite environment variables
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
};

const Signup = ({ userType }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!FormatValidator.validateRequired(formData.firstName)) {
      newErrors.firstName = "First name is required";
    } else if (!FormatValidator.validateName(formData.firstName)) {
      newErrors.firstName =
        "First name contains invalid characters (only letters, hyphens, and underscores allowed)";
    }

    if (!FormatValidator.validateRequired(formData.lastName)) {
      newErrors.lastName = "Last name is required";
    } else if (!FormatValidator.validateName(formData.lastName)) {
      newErrors.lastName =
        "Last name contains invalid characters (only letters, hyphens, and underscores allowed)";
    }

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

    if (!FormatValidator.validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (
      !FormatValidator.validatePasswordMatch(
        formData.password,
        formData.confirmPassword
      )
    ) {
      newErrors.confirmPassword = "Passwords do not match";
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
    // Dummy success - redirect to verification success page
    //navigate("/signup-success");
    const loginData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    console.log(`${userType} signup attempt:`, loginData);

    const signUpRequest = new Request(
      `${API_CONFIG.baseUrl}/auth/${userType.toLowerCase()}/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );
    fetch(signUpRequest)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Sign-up failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Sign-up successful:", data);

        // Store the token in localStorage for authentication
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userType", userType.toLowerCase());
          localStorage.setItem("userData", JSON.stringify(data.data));
        }

        navigate(`/signup-success-${userType.toLowerCase()}`);
      })
      .catch((error) => {
        console.error("Error during sign-up:", error);
        setErrors({ general: "Sign-up failed. Please try again." });
      });
  };

  const handleLoginRedirect = () => {
    navigate(`/login-${userType.toLowerCase()}`);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up as {userType}</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "error" : ""}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "error" : ""}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="signup-btn">
            Sign Up as {userType}
          </button>
        </form>

        <div className="login-link">
          <p>Already have an account?</p>
          <button onClick={handleLoginRedirect} className="login-redirect-btn">
            Login as {userType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
