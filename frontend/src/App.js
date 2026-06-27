import React, { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage/LandingPage';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('error');
        }
      })
      .catch(() => {
        setConnectionStatus('disconnected');
      });
  }, []);

  return (
    <div className="App">
      <LandingPage />

      {/* Floating Developer Backend Status Indicator */}
      <div className={`backend-status-badge ${connectionStatus}`}>
        <span className="status-dot"></span>
        <span className="status-label">
          {connectionStatus === 'checking' && 'Checking backend...'}
          {connectionStatus === 'connected' && 'Backend Connected'}
          {connectionStatus === 'error' && 'Backend API Error'}
          {connectionStatus === 'disconnected' && 'Backend Disconnected (Port 8081)'}
        </span>
      </div>
    </div>
  );
}

export default App;