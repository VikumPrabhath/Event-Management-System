import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import EventDetails from './pages/EventDetails/EventDetails';
import TicketBooking from './components/TicketBooking/TicketBooking';
import AdminLogin from './pages/AdminPortal/AdminLogin';
import AdminDashboard from './pages/AdminPortal/AdminDashboard';
import AddEventPage from './pages/AddEventPage/AddEventPage';
import AdminEventStatsPage from './pages/AdminEventStatsPage/AdminEventStatsPage';
import OrganizerEventStatsPage from './pages/OrganizerEventStatsPage/OrganizerEventStatsPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import OrganizerDashboard from './pages/OrganizerPortal/OrganizerDashboard';
import AuthModal from './components/AuthModal/AuthModal';
import ForgotPasswordModal from './components/ForgotPasswordModal/ForgotPasswordModal';
import OrganizerAuthModal from './components/OrganizerAuthModal/OrganizerAuthModal';
import './App.css';

function AppContent() {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showOrganizerAuthModal, setShowOrganizerAuthModal] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  const handleAdminLogin = (val) => {
    setIsAdminAuthenticated(val);
    localStorage.setItem('admin_authenticated', val ? 'true' : 'false');
  };

  // User Auth State initialized from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user_session', JSON.stringify(userData));
    if (userData.role === 'Organizer') {
      navigate('/organizer/dashboard');
    }
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
    fetch('http://localhost:8081/api/auth/status')
      .then(response => {
        // Any response (ok or unauthorized status) means the backend is up & running!
        setConnectionStatus('connected');
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

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setRefreshTrigger(prev => prev + 1);
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
              refreshTrigger={refreshTrigger}
            />
          } 
        />

        <Route 
          path="/admin" 
          element={
            isAdminAuthenticated ? (
              <AdminDashboard theme={theme} toggleTheme={toggleTheme} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } 
        />
        
        <Route 
          path="/admin/add-event" 
          element={
            isAdminAuthenticated || user?.role === 'Organizer' ? (
              <AddEventPage theme={theme} toggleTheme={toggleTheme} user={user} />
            ) : (
              <Navigate to="/admin" replace />
            )
          } 
        />

        <Route 
          path="/organizer/add-event" 
          element={
            user?.role === 'Organizer' ? (
              <AddEventPage theme={theme} toggleTheme={toggleTheme} user={user} />
            ) : (
              <Navigate to="/organizer" replace />
            )
          } 
        />

        <Route 
          path="/organizer/dashboard" 
          element={
            user?.role === 'Organizer' ? (
              <OrganizerDashboard 
                user={user} 
                onLogout={handleLogout} 
                theme={theme} 
                toggleTheme={toggleTheme} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route 
          path="/admin/event/:id/stats" 
          element={
            isAdminAuthenticated || user?.role === 'Organizer' ? (
              <AdminEventStatsPage theme={theme} toggleTheme={toggleTheme} />
            ) : (
              <Navigate to="/admin" replace />
            )
          } 
        />

        <Route 
          path="/organizer/event/:id/stats" 
          element={
            isAdminAuthenticated || user?.role === 'Organizer' ? (
              <OrganizerEventStatsPage theme={theme} toggleTheme={toggleTheme} />
            ) : (
              <Navigate to="/organizer" replace />
            )
          } 
        />
      </Routes>

      {showBookingModal && (
        <TicketBooking 
          event={selectedEvent} 
          onClose={handleCloseBooking} 
          user={user}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess} 
        onForgotPassword={() => {
          setShowAuthModal(false);
          setShowForgotPasswordModal(true);
        }}
      />
      
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onBackToLogin={() => {
          setShowForgotPasswordModal(false);
          setShowAuthModal(true);
        }}
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