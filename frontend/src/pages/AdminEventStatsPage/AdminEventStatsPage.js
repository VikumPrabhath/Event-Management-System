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
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

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
      ].map(field => `"${field}"`).join(","); // Escape with quotes

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

  const handleCancelEvent = async () => {
    if (!window.confirm('Cancel this event? Existing bookings will be marked as cancelled.')) return;

    setCancelLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/events/${id}/cancel`, { method: 'PUT' });
      if (!res.ok) throw new Error('Failed to cancel event.');
      setEventData(await res.json());
      setAttendees(prev => prev.map(booking => ({ ...booking, status: 'Cancelled' })));
    } catch (err) {
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

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
            <span className="status-badge" style={{background: eventData.status === 'CANCELLED' ? '#c0392b' : 'var(--primary-color)'}}>
              {eventData.status || 'ACTIVE'}
            </span>
          </div>
          {(eventData.status || 'ACTIVE') !== 'CANCELLED' && (
            <button className="cancel-event-btn" onClick={handleCancelEvent} disabled={cancelLoading}>
              {cancelLoading ? 'Cancelling...' : 'Cancel Event'}
            </button>
          )}
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

        {/* Attendees List Section */}
        <div className="admin-section attendees-section" style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>👥 Attendees & Bookings</h3>
            <button className="export-csv-btn" onClick={downloadCSV}>
              📥 Export CSV
            </button>
          </div>
          
          <div className="attendees-table-wrapper" style={{ overflowX: 'auto', background: theme === 'dark' ? '#1a1b23' : '#fff', borderRadius: '12px', border: `1px solid ${theme === 'dark' ? '#333' : '#eee'}` }}>
            {attendees.length > 0 ? (
              <table className="attendees-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: theme === 'dark' ? '#222' : '#f8f9fa', borderBottom: `2px solid ${theme === 'dark' ? '#333' : '#eee'}` }}>
                    <th style={{ padding: '12px 15px', color: theme === 'dark' ? '#ccc' : '#666' }}>Name</th>
                    <th style={{ padding: '12px 15px', color: theme === 'dark' ? '#ccc' : '#666' }}>Contact</th>
                    <th style={{ padding: '12px 15px', color: theme === 'dark' ? '#ccc' : '#666' }}>Tickets</th>
                    <th style={{ padding: '12px 15px', color: theme === 'dark' ? '#ccc' : '#666' }}>Paid</th>
                    <th style={{ padding: '12px 15px', color: theme === 'dark' ? '#ccc' : '#666' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map(attendee => (
                    <tr key={attendee.id} style={{ borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#eee'}` }}>
                      <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>
                        {attendee.customerFirstName} {attendee.customerLastName}
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <div style={{ fontSize: '13px' }}>{attendee.customerEmail}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{attendee.customerPhone}</div>
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        {attendee.selectedTiers && Object.entries(attendee.selectedTiers).map(([tier, qty]) => (
                          qty > 0 && <span key={tier} style={{ display: 'inline-block', background: 'rgba(255, 106, 19, 0.1)', color: '#ff6a13', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', marginRight: '5px' }}>
                            {tier}: {qty}
                          </span>
                        ))}
                      </td>
                      <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>
                        LKR {attendee.totalAmount?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', background: attendee.status === 'Confirmed' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(241, 196, 15, 0.2)', color: attendee.status === 'Confirmed' ? '#2ecc71' : '#f1c40f' }}>
                          {attendee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No attendees yet.</div>
            )}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default AdminEventStatsPage;
