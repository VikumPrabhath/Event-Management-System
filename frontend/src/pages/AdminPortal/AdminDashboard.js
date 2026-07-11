import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AdminDashboard.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventCard from '../../components/EventCard/EventCard';

function AdminDashboard({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [organizers, setOrganizers] = useState([]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/organizers')
      .then(res => res.json())
      .then(data => setOrganizers(data))
      .catch(err => console.error(err));

    fetch('http://localhost:8081/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const handleApproveOrganizer = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/api/organizers/${id}/approve`, {
        method: 'PUT'
      });
      if (res.ok) {
        setOrganizers(prev => prev.map(o => o.id === id ? { ...o, approved: true } : o));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const allEvents = events.map(e => ({
    id: e.id,
    title: e.title,
    location: e.venue || 'TBA',
    date: e.date ? new Date(e.date) : new Date(),
    time: e.timeFrom || '7:00 PM',
    type: e.category || 'General',
    price: e.ticketTiers && e.ticketTiers.length > 0 ? `LKR ${e.ticketTiers[0].price}` : 'Free',
    image: e.imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    status: e.date && new Date(e.date) >= new Date() ? 'Upcoming' : 'History'
  }));

  const upcomingEvents = allEvents.filter(e => e.status === 'Upcoming');
  const historyEvents = allEvents.filter(e => e.status === 'History');

  // Dummy chart data
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 5000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 8900 },
    { name: 'Sat', sales: 12000 },
    { name: 'Sun', sales: 14000 },
  ];

  // Helper to check if two dates are the same day
  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  // Render event indicators on calendar tiles
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = allEvents.filter(event => isSameDay(event.date, date));
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      return (
        <div className="calendar-tile-content">
          {/* Top Right Event Count Badge */}
          {dayEvents.length > 0 && (
            <div className="calendar-event-indicator">
              {dayEvents.length}
            </div>
          )}

          {/* Overlapping Event Dots (Avatars/Circles) */}
          {dayEvents.length > 0 && (
            <div className="calendar-event-dots">
              {dayEvents.slice(0, 3).map((ev, i) => (
                <div key={i} className="event-dot" style={{ backgroundImage: `url(${ev.image})`, zIndex: 3 - i }} />
              ))}
              {dayEvents.length > 3 && <div className="event-dot more-dots">+{dayEvents.length - 3}</div>}
            </div>
          )}

          {/* Hover Overlay Button */}
          <button 
            className="calendar-hover-add-btn" 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/add-event?date=${formattedDate}`);
            }}
            title="Add Event on this date"
          >
            +
          </button>
        </div>
      );
    }
    return null;
  };

  const handleDayClick = (value) => {
    setSelectedDate(value);
  };

  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? allEvents.filter(event => isSameDay(event.date, selectedDate))
    : [];

  return (
    <div className={`admin-portal-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
      
      <main className="admin-dashboard">
        <div className="admin-header">
          <h2>Dashboard Overview</h2>
          <button className="add-event-btn" onClick={() => navigate('/admin/add-event')}>+ Add New Event</button>
        </div>

        {/* Top KPIs */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Events</span>
              <span className="stat-value">{events.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Tickets Issued</span>
              <span className="stat-value">
                {events.reduce((sum, e) => sum + (e.ticketTiers ? e.ticketTiers.reduce((s, t) => s + (t.capacity || 0), 0) : 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Booked Tickets</span>
              <span className="stat-value">
                {events.reduce((sum, e) => sum + (e.ticketsSold || 0), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-middle-row">
          {/* Advanced Chart */}
          <div className="admin-section chart-section">
            <h3>Ticket Sales (This Week)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
                  <XAxis dataKey="name" stroke={theme === 'dark' ? '#ccc' : '#666'} />
                  <YAxis stroke={theme === 'dark' ? '#ccc' : '#666'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#222' : '#fff',
                      borderColor: theme === 'dark' ? '#444' : '#ccc'
                    }} 
                  />
                  <Line type="monotone" dataKey="sales" stroke="#ff6a13" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="admin-section calendar-section">
            <h3>Event Calendar</h3>
            <div className="calendar-container">
              <Calendar 
                className={theme === 'dark' ? 'dark-calendar' : ''}
                tileContent={tileContent}
                onClickDay={handleDayClick}
                value={selectedDate}
              />
            </div>
          </div>
        </div>

        {/* Show Events for Selected Date */}
        {selectedDate && (
          <div className="admin-section selected-date-section">
            <div className="selected-date-header">
              <h3>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
              <button className="clear-date-btn" onClick={() => setSelectedDate(null)}>Close</button>
            </div>
            {selectedDateEvents.length > 0 ? (
              <div className="admin-events-grid">
                {selectedDateEvents.map(event => (
                  <EventCard key={event.id} event={{...event, date: event.date.toLocaleDateString()}} onClick={() => navigate(`/admin/event/${event.id}/stats`)} compactMode={true} />
                ))}
              </div>
            ) : (
              <div className="no-events-message">
                <p>No events scheduled for this day.</p>
                <button 
                  className="center-add-btn" 
                  onClick={() => navigate(`/admin/add-event?date=${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`)}
                >
                  + Add Event Here
                </button>
              </div>
            )}
          </div>
        )}

        {/* Organizer Verification Section */}
        <div className="admin-section organizers-approval-section" style={{marginTop: '40px', background: '#12131a', padding: '20px', borderRadius: '12px', border: '1px solid #1e202c'}}>
          <h3>Organizer Approvals</h3>
          <p className="section-hint">Review and approve organizer registrations so they can log in.</p>
          <div className="organizers-list-table" style={{marginTop: '20px', overflowX: 'auto'}}>
            {organizers.length === 0 ? (
              <p style={{color: '#8b90a0'}}>No organizers registered yet.</p>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                <thead>
                  <tr style={{borderBottom: '1px solid #1e202c', color: '#ff9f43'}}>
                    <th style={{padding: '12px'}}>Org Name</th>
                    <th style={{padding: '12px'}}>Email</th>
                    <th style={{padding: '12px'}}>Phone</th>
                    <th style={{padding: '12px'}}>Status</th>
                    <th style={{padding: '12px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {organizers.map(org => (
                    <tr key={org.id} style={{borderBottom: '1px solid #1e202c', color: '#e0e6ed'}}>
                      <td style={{padding: '12px'}}>{org.orgName}</td>
                      <td style={{padding: '12px'}}>{org.email}</td>
                      <td style={{padding: '12px'}}>{org.phone}</td>
                      <td style={{padding: '12px'}}>
                        <span style={{color: org.approved ? '#2ecc71' : '#f1c40f', fontWeight: 'bold'}}>
                          {org.approved ? 'Approved' : 'Pending Verification'}
                        </span>
                      </td>
                      <td style={{padding: '12px'}}>
                        {!org.approved ? (
                          <button 
                            onClick={() => handleApproveOrganizer(org.id)}
                            style={{background: '#ff6a13', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
                          >
                            Approve
                          </button>
                        ) : (
                          <span style={{color: '#8b90a0'}}>No Action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Upcoming Events Grid */}
        <div className="admin-section recent-events-section" style={{marginTop: '40px'}}>
          <h3>Upcoming Events</h3>
          <p className="section-hint">Click an event to view detailed ticket sales & analytics.</p>
          <div className="admin-events-grid">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={{...event, date: event.date.toLocaleDateString()}} onClick={() => navigate(`/admin/event/${event.id}/stats`)} compactMode={true} />
            ))}
          </div>
        </div>

        {/* Event History / Sold Out Grid */}
        <div className="admin-section history-events-section" style={{marginTop: '40px'}}>
          <h3>Event History & Sold Out</h3>
          <p className="section-hint">View finalized stats for finished or sold out events.</p>
          <div className="admin-events-grid">
            {historyEvents.map(event => (
              <EventCard key={event.id} event={{...event, date: event.date.toLocaleDateString()}} onClick={() => navigate(`/admin/event/${event.id}/stats`)} compactMode={true} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
