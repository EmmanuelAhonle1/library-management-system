import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormatValidator from "../utils/FormatValidator";
import "./Login.css";

// API configuration using Vite environment variables
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
};

const Login = ({ userType }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isAutoLoginAttempted, setIsAutoLoginAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  const verifyTokenAndAutoLogin = useCallback(
    async (token) => {
      // Prevent multiple verification attempts
      if (!isAutoLoginAttempted) {
        try {
          setIsLoading(true);
          // Verify token with backend
          const response = await fetch(
            `${API_CONFIG.baseUrl}/auth/${userType.toLowerCase()}/login`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          // Simulate verification delay
          await new Promise((resolve) => setTimeout(resolve, 1500));

          if (response.ok) {
            // Store the token and user info in localStorage
            if (data.token) {
              localStorage.setItem("authToken", data.token);
              localStorage.setItem("userType", userType.toLowerCase());
              localStorage.setItem("userId", data.data.userId);
            }
            navigate("/item-search");
          } else {
            // If token is invalid, clear localStorage
            localStorage.removeItem("authToken");
            localStorage.removeItem("userType");
            localStorage.removeItem("userId");
          }
        } catch (error) {
          console.error("Auto-login error:", error);
          // If token is invalid, clear localStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("userType");
          localStorage.removeItem("userId");
        } finally {
          // Only set loading to false after all operations (including timeout) are complete
          setIsLoading(false);
          setIsAutoLoginAttempted(true);
        }
      }
    },
    [navigate, userType, isAutoLoginAttempted]
  );

  // Try auto-login when component mounts
  useEffect(() => {
    console.log("Login component mounted/updated with userType:", userType);
    const storedToken = localStorage.getItem("authToken");
    const storedUserType = localStorage.getItem("userType");

    if (storedToken && storedUserType === userType.toLowerCase()) {
      console.log("Attempting auto-login with stored token");
      verifyTokenAndAutoLogin(storedToken);
    } else {
      console.log("No valid token found, showing login form");
      setIsLoading(false);
      setIsAutoLoginAttempted(true);
    }
  }, [verifyTokenAndAutoLogin]); // Remove userType from dependencies

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
    e?.preventDefault(); // Make preventDefault optional for auto-login

    // Only validate form if it's a manual login attempt
    if (e) {
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
    }

    // Don't proceed with login if we haven't tried auto-login yet
    if (!isAutoLoginAttempted) {
      return;
    }

    const loginRequest = new Request(
      `${API_CONFIG.baseUrl}/auth/${userType.toLowerCase()}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    fetch(loginRequest)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        setLoginSuccess(true);

        // Store the token and user info in localStorage
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userType", userType.toLowerCase());
          localStorage.setItem("userId", data.data.userId);
        }

        setTimeout(() => {
          navigate("/item-search");
        }, 1000);
      })
      .catch((error) => {
        console.error("Login error:", error);
        setErrors({ general: "Login failed. Please check your credentials." });
      });
  };

  const handleSignupRedirect = () => {
    navigate(`/signup-${userType.toLowerCase()}`);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{userType} Login</h2>
        {isLoading ? (
          <div className="loading-container">
            <div className="login-loader"></div>
            <p>Checking authentication...</p>
          </div>
        ) : (
          <>
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

              {loginSuccess ? (
                <div className="login-success-container">
                  <div className="login-loader"></div>
                  <div>Success! Navigating to the {userType} dashboard...</div>
                </div>
              ) : (
                <button type="submit" className="login-btn">
                  Login as {userType}
                </button>
              )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
