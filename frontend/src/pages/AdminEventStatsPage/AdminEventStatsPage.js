import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AdminEventStatsPage.css';

function AdminEventStatsPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dummy event data for stats
  const event = {
    id: id,
    title: 'Shina Nayagara Live',
    date: '3 July 2026',
    venue: 'Lotus Tower Colombo',
    status: 'Sold Out',
    totalRevenue: 'LKR 4,500,000',
    totalTicketsSold: 850,
    totalCapacity: 850,
  };

  const ticketData = [
    { name: 'Gold Tickets', sold: 500, total: 500, color: '#f5af19' },
    { name: 'Platinum Tickets', sold: 350, total: 350, color: '#e5e4e2' }
  ];

  const salesTrendData = [
    { day: 'Mon', sales: 120 },
    { day: 'Tue', sales: 150 },
    { day: 'Wed', sales: 180 },
    { day: 'Thu', sales: 90 },
    { day: 'Fri', sales: 210 },
    { day: 'Sat', sales: 100 },
  ];

  return (
    <div className={`admin-portal-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
      
      <main className="admin-stats-page-container">
        <div className="admin-header">
          <button className="back-btn" onClick={() => navigate('/admin')}>← Back to Dashboard</button>
          <div className="stats-header-info">
            <h2 className="page-title">{event.title} - Analytics</h2>
            <span className={`status-badge ${event.status.toLowerCase().replace(' ', '-')}`}>{event.status}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="admin-stats-grid">
          <div className="stat-card">
            <div className="stat-icon calendar-icon">🎟️</div>
            <div className="stat-info">
              <span className="stat-title">Tickets Sold</span>
              <span className="stat-value">{event.totalTicketsSold} / {event.totalCapacity}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon money-icon">💵</div>
            <div className="stat-info">
              <span className="stat-title">Total Revenue</span>
              <span className="stat-value">{event.totalRevenue}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon ticket-icon">📍</div>
            <div className="stat-info">
              <span className="stat-title">Venue</span>
              <span className="stat-value" style={{fontSize: '18px'}}>{event.venue}</span>
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
                    data={ticketData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="sold"
                  >
                    {ticketData.map((entry, index) => (
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
                {ticketData.map((entry, index) => (
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
            <h3>📈 Sales Velocity (Last 6 Days)</h3>
            <div className="chart-container" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesTrendData}>
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
