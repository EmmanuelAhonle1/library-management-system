import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Welcome to Your Dashboard</h1>
        <p>You have successfully logged in to the Library Management System.</p>

        <div className="dashboard-info">
          <div className="info-card">
            <h3>📚 Library Features</h3>
            <ul>
              <li>Browse and search books</li>
              <li>Manage checkouts and returns</li>
              <li>View transaction history</li>
              <li>Manage holds and reservations</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🔧 System Status</h3>
            <p>All systems operational</p>
            <p>Welcome to the dummy dashboard!</p>
            <p>
              This is a placeholder until the full dashboard is implemented.
            </p>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
