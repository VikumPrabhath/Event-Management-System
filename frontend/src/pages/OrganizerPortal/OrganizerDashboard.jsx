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
      <header className="dashboard-header" style={{ height: '64px', backgroundColor: '#0e0f15', borderBottom: '1px solid #1e202c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ margin: 0, color: '#ffffff', fontSize: '20px', fontWeight: '800' }}>
            <span style={{ color: '#ff6a13' }}>{user?.name || 'Organizer'}</span> Portal
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/admin/add-event')} 
            style={{ background: '#ff6a13', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
          >
            + Create New Event
          </button>
          <button 
            onClick={handleLogoutClick} 
            style={{ background: 'transparent', border: '1px solid #2a2d3d', color: '#8b90a0', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="organizer-dashboard" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
        <div className="admin-header" style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '26px', margin: 0 }}>Overview & Events</h2>
          <p style={{ color: '#8b90a0', margin: '5px 0 0 0' }}>Manage events published by your organization</p>
        </div>

        {/* KPIs */}
        <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          <div className="stat-card" style={{ background: '#161822', border: '1px solid #232533', padding: '20px', borderRadius: '12px' }}>
            <div className="stat-info">
              <span className="stat-title" style={{ color: '#8b90a0', fontSize: '13px' }}>Your Published Events</span>
              <h3 className="stat-value" style={{ margin: '10px 0 0 0', fontSize: '28px', color: '#ffffff' }}>{events.length}</h3>
            </div>
          </div>
          <div className="stat-card" style={{ background: '#161822', border: '1px solid #232533', padding: '20px', borderRadius: '12px' }}>
            <div className="stat-info">
              <span className="stat-title" style={{ color: '#8b90a0', fontSize: '13px' }}>Total Tickets Issued</span>
              <h3 className="stat-value" style={{ margin: '10px 0 0 0', fontSize: '28px', color: '#ffffff' }}>{totalTickets}</h3>
            </div>
          </div>
          <div className="stat-card" style={{ background: '#161822', border: '1px solid #232533', padding: '20px', borderRadius: '12px' }}>
            <div className="stat-info">
              <span className="stat-title" style={{ color: '#8b90a0', fontSize: '13px' }}>Total Tickets Booked</span>
              <h3 className="stat-value" style={{ margin: '10px 0 0 0', fontSize: '28px', color: '#ffffff' }}>{totalSold}</h3>
            </div>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="admin-section" style={{ marginBottom: '40px' }}>
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid #1e202c', paddingBottom: '10px' }}>Your Upcoming Events</h3>
          {loading ? (
            <p style={{ color: '#8b90a0' }}>Loading events...</p>
          ) : upcomingEvents.length === 0 ? (
            <p style={{ color: '#8b90a0' }}>No upcoming events scheduled. Create one to get started!</p>
          ) : (
            <div className="organizer-events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {upcomingEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={{
                    ...event, 
                    price: event.ticketTiers && event.ticketTiers.length > 0 ? `LKR ${event.ticketTiers[0].price}` : 'Free'
                  }} 
                  onClick={() => navigate(`/admin/event/${event.id}/stats`)} 
                  compactMode={true} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Past History Section */}
        <div className="admin-section">
          <h3 style={{ fontSize: '18px', borderBottom: '1px solid #1e202c', paddingBottom: '10px' }}>Event History</h3>
          {loading ? (
            <p style={{ color: '#8b90a0' }}>Loading events...</p>
          ) : pastEvents.length === 0 ? (
            <p style={{ color: '#8b90a0' }}>No past events found.</p>
          ) : (
            <div className="organizer-events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {pastEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={{
                    ...event, 
                    price: event.ticketTiers && event.ticketTiers.length > 0 ? `LKR ${event.ticketTiers[0].price}` : 'Free'
                  }} 
                  onClick={() => navigate(`/admin/event/${event.id}/stats`)} 
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
