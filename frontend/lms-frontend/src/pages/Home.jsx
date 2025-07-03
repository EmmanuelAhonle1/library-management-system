import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Library Management System</h1>
        <p>
          Welcome to the Library Management System. Please choose your account
          type to continue.
        </p>

        <div className="user-type-selection">
          <div className="user-type-card">
            <h3>Client</h3>
            <p>
              Browse books, manage checkouts, and track your reading history
            </p>
            <div className="card-buttons">
              <button
                onClick={() => navigate("/login-client")}
                className="btn-primary"
              >
                Login as Client
              </button>
              <button
                onClick={() => navigate("/signup-client")}
                className="btn-secondary"
              >
                Sign Up as Client
              </button>
            </div>
          </div>

          <div className="user-type-card">
            <h3>Librarian</h3>
            <p>
              Manage inventory, process transactions, and oversee library
              operations
            </p>
            <div className="card-buttons">
              <button
                onClick={() => navigate("/login-librarian")}
                className="btn-primary"
              >
                Login as Librarian
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
