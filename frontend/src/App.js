import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import EventDetails from './pages/EventDetails/EventDetails';
import TicketBooking from './components/TicketBooking/TicketBooking';
import AdminLogin from './pages/AdminPortal/AdminLogin';
import AdminDashboard from './pages/AdminPortal/AdminDashboard';
import AddEventPage from './pages/AddEventPage/AddEventPage';
import AdminEventStatsPage from './pages/AdminEventStatsPage/AdminEventStatsPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import AuthModal from './components/AuthModal/AuthModal';
import OrganizerAuthModal from './components/OrganizerAuthModal/OrganizerAuthModal';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrganizerAuthModal, setShowOrganizerAuthModal] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // User Auth State initialized from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('user_session', JSON.stringify(updatedData));
  };

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
    const eventId = eventData.id || 'event-details';
    navigate(`/event/${eventId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (eventData) => {
    if (eventData) setSelectedEvent(eventData);
    setShowBookingModal(true);
  };

  return (
    <div className={`App ${theme}-theme`}>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              onSelectEvent={handleSelectEvent} 
              theme={theme} 
              toggleTheme={toggleTheme} 
              user={user}
              onOpenAuth={() => setShowAuthModal(true)}
              onOpenOrganizerAuth={() => setShowOrganizerAuthModal(true)}
            />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <UserDashboard 
              user={user} 
              onLogout={handleLogout} 
              onUpdateUser={handleUpdateUser} 
            />
          } 
        />

        <Route 
          path="/event/:id" 
          element={
            <EventDetails 
              event={selectedEvent} 
              onBack={() => navigate('/')}
              onOpenBooking={handleOpenBooking}
              theme={theme}
              toggleTheme={toggleTheme}
            />
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

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <OrganizerAuthModal 
        isOpen={showOrganizerAuthModal}
        onClose={() => setShowOrganizerAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;