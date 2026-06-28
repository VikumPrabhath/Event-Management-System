import React, { useState } from 'react';
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
  
  const allEvents = [
    { 
      id: 2, 
      title: 'Chadrapala', 
      location: 'Galle Face', 
      date: new Date(2026, 6, 4), // Month is 0-indexed: 6 = July
      time: '9:00 PM',
      type: 'Drama',
      price: 'LKR 5,000',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
      status: 'Upcoming'
    },
    { 
      id: 4, 
      title: 'Summer Music Fest', 
      location: 'Viharamahadevi Park', 
      date: new Date(2026, 6, 4), 
      time: '2:00 PM',
      type: 'Festival',
      price: 'LKR 3,500',
      image: 'https://images.unsplash.com/photo-1533174000243-c78278f0d869?auto=format&fit=crop&q=80&w=800',
      status: 'Upcoming'
    },
    { 
      id: 5, 
      title: 'Tech Meetup 2026', 
      location: 'BMICH', 
      date: new Date(2026, 6, 4), 
      time: '10:00 AM',
      type: 'Conference',
      price: 'Free',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
      status: 'Upcoming'
    },
    { 
      id: 6, 
      title: 'Comedy Night', 
      location: 'Nelum Pokuna', 
      date: new Date(2026, 6, 4), 
      time: '8:30 PM',
      type: 'Comedy',
      price: 'LKR 4,000',
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=800',
      status: 'Upcoming'
    },
    { 
      id: 7, 
      title: 'Midnight Jazz', 
      location: 'Galle Face Hotel', 
      date: new Date(2026, 6, 4), 
      time: '11:00 PM',
      type: 'Music',
      price: 'LKR 6,000',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
      status: 'Upcoming'
    },
    { 
      id: 1, 
      title: 'Shina Nayagara', 
      location: 'Lotus Tower Colombo', 
      date: new Date(2026, 6, 3), 
      time: '7:00 PM',
      type: 'Sold Out',
      price: 'LKR 9,990',
      image: 'https://images.unsplash.com/photo-1540039155733-d7696ba6dd36?auto=format&fit=crop&q=80&w=800',
      status: 'History'
    },
    { 
      id: 3, 
      title: 'Rhythms of the Night', 
      location: 'BMICH', 
      date: new Date(2026, 6, 5), 
      time: '5:30 PM',
      type: 'Finished',
      price: 'LKR 8,500',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800',
      status: 'History'
    }
  ];

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
              <span className="stat-value">124</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Tickets</span>
              <span className="stat-value">14,500</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-title">Total Earnings</span>
              <span className="stat-value">LKR 4.5M</span>
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
