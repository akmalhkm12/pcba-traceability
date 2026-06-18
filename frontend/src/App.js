import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import PCBADetails from './components/PCBADetails';
import CreatePCBA from './components/CreatePCBA';
import AssemblyProcess from './components/AssemblyProcess';
import Testing from './components/Testing';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">PCBA Traceability System</h1>
            <ul className="nav-menu">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/scanner">Scanner</Link></li>
              <li><Link to="/create">Create PCBA</Link></li>
              <li><Link to="/assembly">Assembly</Link></li>
              <li><Link to="/testing">Testing</Link></li>
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
