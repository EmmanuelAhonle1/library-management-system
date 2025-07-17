import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FaCog } from "react-icons/fa"; // You'll need to install react-icons: npm install react-icons
import { jwtDecode } from "jwt-decode";
const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    title: "",
    genre: "",
    creator: "",
  });

  // Get user data from localStorage
  const token = localStorage.getItem("authToken");
  const decodedToken = jwtDecode(token);
  const firstName = decodedToken.firstName || "User";

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = async (filterParams = {}) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        // No token found, redirect to login
        navigate("/login-client");
        return;
      }

      const response = await fetch("/api/items/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filterParams),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          navigate("/login-client");
          return;
        }
        throw new Error("Failed to fetch items");
      }

      const data = await response.json();
      setItems(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(filters);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-message">
          <h2>Welcome, {firstName}! 👋</h2>
        </div>
        <div className="header-controls">
          <button onClick={handleSettings} className="settings-btn">
            <FaCog /> Settings
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="search-section">
          <h3>Search Library Items</h3>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-fields">
              <input
                type="text"
                name="title"
                placeholder="Search by title..."
                value={filters.title}
                onChange={handleFilterChange}
              />
              <input
                type="text"
                name="genre"
                placeholder="Filter by genre..."
                value={filters.genre}
                onChange={handleFilterChange}
              />
              <input
                type="text"
                name="creator"
                placeholder="Search by author/creator..."
                value={filters.creator}
                onChange={handleFilterChange}
              />
              <button type="submit" className="search-btn">
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="items-section">
          {loading ? (
            <div className="loading">Loading items...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <h3>{item.title}</h3>
                  <p>Genre: {item.genre}</p>
                  <p>Creator: {item.creator}</p>
                  <p>Status: {item.available ? "Available" : "Checked Out"}</p>
                  {item.available && (
                    <button className="checkout-btn">Checkout</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
