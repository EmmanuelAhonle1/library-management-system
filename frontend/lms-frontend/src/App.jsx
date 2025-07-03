import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import ClientLogin from './pages/ClientLogin';
import LibrarianLogin from './pages/LibrarianLogin';
import ClientSignup from './pages/ClientSignup';
import LibrarianSignup from './pages/LibrarianSignup';
import Dashboard from './pages/Dashboard';
import SignupSuccess from './pages/SignupSuccess';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-client" element={<ClientLogin />} />
          <Route path="/login-librarian" element={<LibrarianLogin />} />
          <Route path="/signup-client" element={<ClientSignup />} />
          <Route path="/signup-librarian" element={<LibrarianSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup-success" element={<SignupSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
