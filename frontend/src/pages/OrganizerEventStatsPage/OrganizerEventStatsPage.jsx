import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './OrganizerEventStatsPage.css';

function OrganizerEventStatsPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [eventData, setEventData] = useState(null);
  const [stats, setStats] = useState(null);
  const [attendees, setAttendees] = useState([]);
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

    // Fetch Attendees
    fetch(`http://localhost:8081/api/bookings/event/${id}/attendees`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAttendees(data);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const downloadCSV = () => {
    if (!attendees || attendees.length === 0) return;
    
    // Define CSV headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Booking ID,First Name,Last Name,Email,Phone,NIC,Total Paid,Status,Tickets\n";

    attendees.forEach(b => {
      // Format tickets array into a string
      let ticketsStr = "";
      if (b.selectedTiers) {
        ticketsStr = Object.entries(b.selectedTiers)
          .map(([tier, qty]) => `${tier}(${qty})`)
          .join(" | ");
      }
      
      const row = [
        b.id,
        b.customerFirstName || "",
        b.customerLastName || "",
        b.customerEmail || "",
        b.customerPhone || "",
        b.customerNic || "",
        b.totalAmount || 0,
        b.status || "",
        ticketsStr
      ].map(field => `"${field}"`).join(",");

      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `event-${id}-attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`organizer-stats-wrapper ${theme}-mode`}>
        <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
        <main className="organizer-stats-page-container">
          <h2 className="loading-text">Loading Analytics...</h2>
        </main>
      </div>
    );
  }

  if (!eventData || !stats) {
    return (
      <div className={`organizer-stats-wrapper ${theme}-mode`}>
        <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
        <main className="organizer-stats-page-container">
          <h2 className="not-found-text">Event or Stats not found.</h2>
        </main>
      </div>
    );
  }

  return (
    <div className={`organizer-stats-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
      
      <main className="organizer-stats-page-container">
        <div className="organizer-stats-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="stats-header-info">
            <h2 className="page-title">{eventData.title} - Analytics</h2>
            <span className="status-badge active-badge">ACTIVE</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="organizer-stats-grid">
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
              <span className="stat-value venue-value">{eventData.venue}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-middle-row">
          {/* Ticket Breakdown Pie Chart */}
          <div className="organizer-section chart-section">
            <h3 className="section-title">🎟️ Ticket Tier Breakdown</h3>
            <div className="chart-container">
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
          <div className="organizer-section chart-section">
            <h3 className="section-title">📈 Sales Velocity</h3>
            <div className="chart-container">
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

        {/* Attendees List Section */}
        <div className="organizer-section attendees-section">
          <div className="attendees-header">
            <h3 className="section-title">👥 Attendees & Bookings</h3>
            <button className="export-csv-btn" onClick={downloadCSV}>
              📥 Export CSV
            </button>
          </div>
          
          <div className="attendees-table-wrapper">
            {attendees.length > 0 ? (
              <table className="attendees-table">
                <thead>
                  <tr className="table-header-row">
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Tickets</th>
                    <th>Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map(attendee => (
                    <tr key={attendee.id} className="table-body-row">
                      <td className="attendee-name">
                        {attendee.customerFirstName} {attendee.customerLastName}
                      </td>
                      <td className="attendee-contact">
                        <div className="attendee-email">{attendee.customerEmail}</div>
                        <div className="attendee-phone">{attendee.customerPhone}</div>
                      </td>
                      <td className="attendee-tickets">
                        {attendee.selectedTiers && Object.entries(attendee.selectedTiers).map(([tier, qty]) => (
                          qty > 0 && <span key={tier} className="ticket-tier-badge">
                            {tier}: {qty}
                          </span>
                        ))}
                      </td>
                      <td className="attendee-paid">
                        LKR {attendee.totalAmount?.toLocaleString()}
                      </td>
                      <td className="attendee-status">
                        <span className={`status-badge status-${attendee.status?.toLowerCase() || 'pending'}`}>
                          {attendee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-attendees">No attendees yet.</div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default OrganizerEventStatsPage;