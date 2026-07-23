import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login Admin */}
        <Route path="/login" element={<Login />} />
        
        {/* Halaman Utama Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Jika URL tidak dikenal, otomatis lempar ke halaman login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;