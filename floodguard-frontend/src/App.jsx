import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import RiskPredictor from './pages/RiskPredictor';
import ReportIncident from './pages/ReportIncident';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0f1e] text-slate-100 font-['Inter',sans-serif]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<RiskPredictor />} />
            <Route path="/report" element={<ReportIncident />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
