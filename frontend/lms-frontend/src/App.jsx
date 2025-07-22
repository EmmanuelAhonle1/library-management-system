import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import pages
import Home from "./pages/Home";
import ClientLogin from "./pages/ClientLogin";
import LibrarianLogin from "./pages/LibrarianLogin";
import ClientSignup from "./pages/ClientSignup";
import LibrarianSignup from "./pages/LibrarianSignup";
import ItemSearch from "./pages/ItemSearch";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <div className="App">
        <h1 className="app-title">📚 Library Management System</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-client" element={<ClientLogin />} />
          <Route path="/login-librarian" element={<LibrarianLogin />} />
          <Route path="/signup-client" element={<ClientSignup />} />
          <Route path="/signup-librarian" element={<LibrarianSignup />} />
          <Route path="/item-search" element={<ItemSearch />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
