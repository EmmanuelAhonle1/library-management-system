import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ItemSearch.css";
import { FaCog } from "react-icons/fa"; // You'll need to install react-icons: npm install react-icons
import { jwtDecode } from "jwt-decode";

// API configuration using Vite environment variables
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
};

const ItemSearch = () => {
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

  const fetchItems = async (filterParams = filters) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        // No token found, redirect to login
        navigate("/Home");
        return;
      }

      const queryParams = new URLSearchParams(filterParams);

      const response = await fetch(
        `${API_CONFIG.baseUrl}/items/search?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

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
    <div className="item-search-container">
      <header className="item-search-header">
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

      <div className="item-search-content">
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
            <div className="loading">
              <div className="login-loader"></div>
              <p>Loading items...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-main-content">
                    <div className="item-header">
                      <h3>{item.title}</h3>
                      <span
                        className={`status-badge ${item.status ? "available" : "checked-out"}`}
                      >
                        {item.status ? "Available" : "Checked Out"}
                      </span>
                    </div>
                    <div className="item-primary-details">
                      <p>
                        <strong>Genre:</strong> {item.genre}
                      </p>
                      <p>
                        <strong>Creator:</strong> {item.creator}
                      </p>
                    </div>
                    <div className="item-actions">
                      {item.status && (
                        <button className="checkout-btn">Checkout</button>
                      )}
                      <button className="details-btn">View Details</button>
                    </div>
                  </div>
                  <div className="item-details-drawer">
                    <h4>Additional Details</h4>
                    <div className="details-grid">
                      <p>
                        <strong>ISBN:</strong> {item.isbn || "N/A"}
                      </p>
                      <p>
                        <strong>Publisher:</strong> {item.publisher || "N/A"}
                      </p>
                      <p>
                        <strong>Publication Year:</strong>{" "}
                        {item.publication_year || "N/A"}
                      </p>
                      <p>
                        <strong>Language:</strong> {item.language || "N/A"}
                      </p>
                      <p>
                        <strong>Pages:</strong> {item.pages || "N/A"}
                      </p>
                      <p>
                        <strong>Format:</strong> {item.format || "N/A"}
                      </p>
                      <p>
                        <strong>Location:</strong> {item.location || "N/A"}
                      </p>
                      <p>
                        <strong>Added On:</strong>{" "}
                        {new Date(item.date_added).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemSearch;
