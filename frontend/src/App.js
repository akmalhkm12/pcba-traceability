import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import PCBADetails from './components/PCBADetails';
import CreatePCBA from './components/CreatePCBA';
import AssemblyProcess from './components/AssemblyProcess';
import Testing from './components/Testing';

function App() {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Apply theme to document root and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <div className="company-header">
              <div className="company-info">
                <h1>PCBA Traceability System</h1>
              </div>
            </div>
            <ul className="nav-menu">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/scanner">Scanner</Link></li>
              <li><Link to="/create">Create PCBA</Link></li>
              <li><Link to="/assembly">Assembly</Link></li>
              <li><Link to="/testing">Testing</Link></li>
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <span className="theme-toggle-icon">
                  {theme === 'light' ? '🌙' : '☀️'}
                </span>
                {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </ul>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/pcba/:identifier" element={<PCBADetails />} />
            <Route path="/create" element={<CreatePCBA />} />
            <Route path="/assembly" element={<AssemblyProcess />} />
            <Route path="/testing" element={<Testing />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
