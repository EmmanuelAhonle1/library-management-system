import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignupSuccess.css";

const SignupSuccess = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">✅</div>
        <h1>Account Created Successfully!</h1>
        <p>
          Congratulations! Your account has been created successfully. You can
          now log in to access the Library Management System.
        </p>

        <div className="success-info">
          <div className="info-box">
            <h3>What's Next?</h3>
            <ul>
              <li>Check your email for account verification (if applicable)</li>
              <li>Log in with your credentials</li>
              <li>Start exploring the library system</li>
              <li>Update your profile information</li>
            </ul>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={handleLoginRedirect} className="btn-primary">
            Go to Login
          </button>
          <button onClick={handleBackToHome} className="btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
