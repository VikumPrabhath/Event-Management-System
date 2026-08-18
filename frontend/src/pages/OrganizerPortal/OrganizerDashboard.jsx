import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventCard from '../../components/EventCard/EventCard';
import './OrganizerDashboard.css';

function OrganizerDashboard({ user, onLogout, theme, toggleTheme }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetch(`http://localhost:8081/api/events/organizer/${user.id}`)
        .then(res => res.json())
        .then(data => {
          setEvents(data);
        })
        .catch(err => {
          console.error('Error fetching organizer events:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user?.id]);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  // Split into upcoming and past based on current date
  const now = new Date();
  const upcomingEvents = events.filter(e => {
    if (!e.date) return true;
    return new Date(e.date) >= now;
  });

  const pastEvents = events.filter(e => {
    if (!e.date) return false;
    return new Date(e.date) < now;
  });

  const totalTickets = events.reduce((sum, e) => {
    const capacities = e.ticketTiers ? e.ticketTiers.reduce((s, t) => s + (t.capacity || 0), 0) : 0;
    return sum + capacities;
  }, 0);

  const totalSold = events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0);

  return (
    <div className={`organizer-portal-wrapper ${theme}-mode`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h2 className="dashboard-header-title">
            <span className="dashboard-header-name">{user?.name || 'Organizer'}</span> Portal
          </h2>
        </div>
        <div className="dashboard-header-right">
          <button 
            className="create-event-btn"
            onClick={() => navigate('/organizer/add-event')}
          >
            + Create New Event
          </button>
          <button 
            className="logout-header-btn"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="organizer-dashboard-main">
        <div className="admin-header">
          <h2 className="admin-header-title">Overview & Events</h2>
          <p className="admin-header-subtitle">Manage events published by your organization</p>
        </div>

        {/* KPIs */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Your Published Events</span>
              <h3 className="stat-value">{events.length}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Tickets Issued</span>
              <h3 className="stat-value">{totalTickets}</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Tickets Booked</span>
              <h3 className="stat-value">{totalSold}</h3>
            </div>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="admin-section">
          <h3 className="section-title">Your Upcoming Events</h3>
          {loading ? (
            <p className="loading-text">Loading events...</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="empty-text">No upcoming events scheduled. Create one to get started!</p>
          ) : (
            <div className="organizer-events-grid">
              {upcomingEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={{
                    ...event, 
                    price: event.ticketTiers && event.ticketTiers.length > 0 ? `LKR ${event.ticketTiers[0].price}` : 'Free'
                  }} 
                  onClick={() => navigate(`/organizer/event/${event.id}/stats`)} 
                  compactMode={true} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Past History Section */}
        <div className="admin-section">
          <h3 className="section-title">Event History</h3>
          {loading ? (
            <p className="loading-text">Loading events...</p>
          ) : pastEvents.length === 0 ? (
            <p className="empty-text">No past events found.</p>
          ) : (
            <div className="organizer-events-grid">
              {pastEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={{
                    ...event, 
                    price: event.ticketTiers && event.ticketTiers.length > 0 ? `LKR ${event.ticketTiers[0].price}` : 'Free'
                  }} 
                  onClick={() => navigate(`/organizer/event/${event.id}/stats`)} 
                  compactMode={true} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrganizerDashboard;