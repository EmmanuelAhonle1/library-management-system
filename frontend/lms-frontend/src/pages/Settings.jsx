import React from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-header">
          <h2>Account Settings</h2>
          <button onClick={handleBack} className="back-btn">
            ← Back
          </button>
        </div>

        <div className="settings-section">
          <h3>Profile Information</h3>
          <div className="profile-info">
            <div className="info-group">
              <label>Name</label>
              <p>
                {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div className="info-group">
              <label>Email</label>
              <p>{userData.email}</p>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="preferences">
            <div className="preference-item">
              <label className="toggle-label">
                Email Notifications
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <label className="toggle-label">
                Due Date Reminders
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Account Actions</h3>
          <div className="action-buttons">
            <button className="change-password-btn">Change Password</button>
            <button className="delete-account-btn">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
