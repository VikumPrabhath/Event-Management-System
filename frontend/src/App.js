import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import EventDetails from './pages/EventDetails/EventDetails';
import TicketBooking from './components/TicketBooking/TicketBooking';
import AdminLogin from './pages/AdminPortal/AdminLogin';
import AdminDashboard from './pages/AdminPortal/AdminDashboard';
import AddEventPage from './pages/AddEventPage/AddEventPage';
import AdminEventStatsPage from './pages/AdminEventStatsPage/AdminEventStatsPage';
import './App.css';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

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

  const handleSelectEvent = (eventData) => {
    setSelectedEvent(eventData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (eventData) => {
    if (eventData) setSelectedEvent(eventData);
    setShowBookingModal(true);
  };

  return (
    <Router>
      <div className={`App ${theme}-theme`}>
        
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage onSelectEvent={handleSelectEvent} theme={theme} toggleTheme={toggleTheme} />} 
          />
          
          <Route 
            path="/event/:id" 
            element={
              selectedEvent ? (
                <EventDetails 
                  event={selectedEvent} 
                  onOpenBooking={handleOpenBooking}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />

          <Route 
            path="/admin" 
            element={
              isAdminAuthenticated ? (
                <AdminDashboard theme={theme} toggleTheme={toggleTheme} />
              ) : (
                <AdminLogin onLogin={setIsAdminAuthenticated} />
              )
            } 
          />
          
          <Route 
            path="/admin/add-event" 
            element={
              isAdminAuthenticated ? (
                <AddEventPage theme={theme} toggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/admin" replace />
              )
            } 
          />

          <Route 
            path="/admin/event/:id/stats" 
            element={
              isAdminAuthenticated ? (
                <AdminEventStatsPage theme={theme} toggleTheme={toggleTheme} />
              ) : (
                <Navigate to="/admin" replace />
              )
            } 
          />
        </Routes>

        {showBookingModal && (
          <TicketBooking 
            event={selectedEvent} 
            onClose={() => setShowBookingModal(false)} 
          />
        )}

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
    </Router>
  );
}

export default App;