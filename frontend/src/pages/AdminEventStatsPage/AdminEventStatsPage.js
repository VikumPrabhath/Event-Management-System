import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AdminEventStatsPage.css';

function AdminEventStatsPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [eventData, setEventData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Event Details
    fetch(`http://localhost:8081/api/events/${id}`)
      .then(res => res.json())
      .then(data => setEventData(data))
      .catch(err => console.error(err));

    // Fetch Event Stats
    fetch(`http://localhost:8081/api/bookings/event/${id}/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={`admin-portal-wrapper ${theme}-mode`}>
        <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
        <main className="admin-stats-page-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <h2>Loading Analytics...</h2>
        </main>
      </div>
    );
  }

  if (!eventData || !stats) {
    return (
      <div className={`admin-portal-wrapper ${theme}-mode`}>
        <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
        <main className="admin-stats-page-container" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <h2>Event or Stats not found.</h2>
        </main>
      </div>
    );
  }

  return (
    <div className={`admin-portal-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
      
      <main className="admin-stats-page-container">
        <div className="admin-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="stats-header-info">
            <h2 className="page-title">{eventData.title} - Analytics</h2>
            <span className="status-badge" style={{background: 'var(--primary-color)'}}>ACTIVE</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon calendar-icon">🎟️</div>
            <div className="stat-info">
              <span className="stat-title">Tickets Sold</span>
              <span className="stat-value">{stats.totalTicketsSold} / {stats.totalCapacity}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon money-icon">💵</div>
            <div className="stat-info">
              <span className="stat-title">Total Revenue</span>
              <span className="stat-value">{stats.totalRevenue}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon ticket-icon">📍</div>
            <div className="stat-info">
              <span className="stat-title">Venue</span>
              <span className="stat-value" style={{fontSize: '18px'}}>{eventData.venue}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-middle-row">
          {/* Ticket Breakdown Pie Chart */}
          <div className="admin-section chart-section">
            <h3>🎟️ Ticket Tier Breakdown</h3>
            <div className="chart-container" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.ticketData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="sold"
                  >
                    {stats.ticketData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#222' : '#fff',
                      borderColor: theme === 'dark' ? '#444' : '#ccc'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {stats.ticketData.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{backgroundColor: entry.color}}></span>
                    {entry.name}: {entry.sold} Sold
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Trend Bar Chart */}
          <div className="admin-section chart-section">
            <h3>📈 Sales Velocity</h3>
            <div className="chart-container" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} vertical={false} />
                  <XAxis dataKey="day" stroke={theme === 'dark' ? '#ccc' : '#666'} />
                  <YAxis stroke={theme === 'dark' ? '#ccc' : '#666'} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#222' : '#fff',
                      borderColor: theme === 'dark' ? '#444' : '#ccc'
                    }} 
                  />
                  <Bar dataKey="sales" fill="#ff6a13" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default AdminEventStatsPage;
