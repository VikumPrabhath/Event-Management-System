import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './OrganizerEventStatsPage.css';

function OrganizerEventStatsPage({ theme, toggleTheme, user: propUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // Get user from location state if not passed as prop
  const user = propUser || location.state?.user;

  const [eventData, setEventData] = useState(null);
  const [stats, setStats] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  // Edit form states
  const [editEventName, setEditEventName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editTimeFrom, setEditTimeFrom] = useState('');
  const [editTimeTo, setEditTimeTo] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editTrendingTag, setEditTrendingTag] = useState('');
  const [editTicketTiers, setEditTicketTiers] = useState([]);
  const [editEarlyBirdDiscount, setEditEarlyBirdDiscount] = useState(0);
  const [editEarlyBirdLimit, setEditEarlyBirdLimit] = useState(0);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    // Fetch Event Details
    fetch(`http://localhost:8081/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        setEventData(data);
        // Populate edit form with event data
        setEditEventName(data.title || '');
        setEditCategory(data.category || 'music');
        setEditDescription(data.description || '');
        setEditVenue(data.venue || '');
        setEditEventDate(data.date || '');
        setEditTimeFrom(data.timeFrom || '18:00');
        setEditTimeTo(data.timeTo || '22:00');
        setEditImageUrl(data.imageUrl || '');
        setEditTrendingTag(data.trendingTag || '');
        setEditTicketTiers(data.ticketTiers || [{ name: 'Gold', capacity: 100, price: 5000 }]);
        setEditEarlyBirdDiscount(data.earlyBirdDiscount || 0);
        setEditEarlyBirdLimit(data.earlyBirdLimit || 0);
      })
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
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Booking ID,First Name,Last Name,Email,Phone,NIC,Total Paid,Status,Tickets\n";

    attendees.forEach(b => {
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

  // Edit handlers
  const handleEditTierChange = (index, field, value) => {
    const updated = [...editTicketTiers];
    if (field === 'capacity') {
      updated[index].capacity = parseInt(value) || 0;
    } else if (field === 'price') {
      updated[index].price = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setEditTicketTiers(updated);
  };

  const handleAddEditTier = () => {
    setEditTicketTiers([...editTicketTiers, { name: '', capacity: 0, price: 0 }]);
  };

  const handleRemoveEditTier = (index) => {
    setEditTicketTiers(editTicketTiers.filter((_, i) => i !== index));
  };

  const handleEditImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    const payload = {
      title: editEventName,
      category: editCategory,
      description: editDescription,
      venue: editVenue,
      date: editEventDate,
      timeFrom: editTimeFrom,
      timeTo: editTimeTo,
      imageUrl: editImageUrl || '/assets/default-event.jpg',
      trendingTag: editTrendingTag,
      ticketTiers: editTicketTiers,
      earlyBirdDiscount: parseFloat(editEarlyBirdDiscount) || 0,
      earlyBirdLimit: parseInt(editEarlyBirdLimit) || 0,
      organizerId: user?.role === 'Organizer' ? user.id : null
    };

    try {
      const res = await fetch(`http://localhost:8081/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to update event.');
      }

      const updatedEvent = await res.json();
      setEventData(updatedEvent);
      setShowEditForm(false);
      // Refresh stats
      fetch(`http://localhost:8081/api/bookings/event/${id}/stats`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    } catch (err) {
      console.error(err);
      setEditError(err.message || 'Error occurred while updating event.');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`organizer-stats-wrapper ${theme}-mode`}>
        <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} user={user} />
        <main className="organizer-stats-page-container">
          <h2 className="loading-text">Loading Analytics...</h2>
        </main>
      </div>
    );
  }

  if (!eventData || !stats) {
    return (
      <div className={`organizer-stats-wrapper ${theme}-mode`}>
        <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} user={user} />
        <main className="organizer-stats-page-container">
          <h2 className="not-found-text">Event or Stats not found.</h2>
        </main>
      </div>
    );
  }

  return (
    <div className={`organizer-stats-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} user={user} />
      
      <main className="organizer-stats-page-container">
        <div className="organizer-stats-header">
          <div className="stats-header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <div className="stats-header-info">
              <h2 className="page-title">{eventData.title} - Analytics</h2>
              <span className="status-badge active-badge">ACTIVE</span>
            </div>
          </div>
          <div className="stats-header-right">
            <button className="edit-event-btn" onClick={() => setShowEditForm(!showEditForm)}>
              {showEditForm ? '✕ Close Edit' : '✎ Edit Event'}
            </button>
          </div>
        </div>

        {/* Event Banner */}
        <div className="event-banner-section">
          <img 
            src={eventData.imageUrl || '/assets/default-event.jpg'} 
            alt={eventData.title} 
            className="event-banner-image"
            onError={(e) => { e.target.src = '/assets/default-event.jpg'; }}
          />
          <div className="event-banner-overlay">
            <div className="event-banner-info">
              <h1 className="event-banner-title">{eventData.title}</h1>
              <div className="event-banner-meta">
                <span className="event-banner-category">{eventData.category || 'General'}</span>
                <span className="event-banner-venue">📍 {eventData.venue || 'TBD'}</span>
                <span className="event-banner-date">📅 {eventData.date ? new Date(eventData.date).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {showEditForm && (
          <div className="edit-event-form-container">
            <h3 className="edit-form-title">✎ Edit Event</h3>
            {editError && <div className="edit-error-banner">{editError}</div>}
            <form onSubmit={handleUpdateEvent} className="edit-event-form">
              <div className="edit-form-grid">
                <div className="edit-form-column">
                  <div className="edit-form-group">
                    <label>Event Name</label>
                    <input 
                      type="text" 
                      value={editEventName}
                      onChange={(e) => setEditEventName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Category</label>
                    <select 
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      required
                    >
                      <option value="music">Concert & Music</option>
                      <option value="drama">Art & Drama</option>
                      <option value="sports">Sport & Adventure</option>
                      <option value="family">Family & Others</option>
                      <option value="tech-meetup">Tech Meetup</option>
                      <option value="dev-meetup">Developer Meetup</option>
                    </select>
                  </div>
                  <div className="edit-form-group">
                    <label>Description</label>
                    <textarea 
                      rows="3"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Venue</label>
                    <input 
                      type="text" 
                      value={editVenue}
                      onChange={(e) => setEditVenue(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="edit-form-column">
                  <div className="edit-form-group">
                    <label>Date</label>
                    <input 
                      type="date" 
                      value={editEventDate}
                      onChange={(e) => setEditEventDate(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="edit-form-row">
                    <div className="edit-form-group half">
                      <label>Time From</label>
                      <input 
                        type="time" 
                        value={editTimeFrom}
                        onChange={(e) => setEditTimeFrom(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="edit-form-group half">
                      <label>Time To</label>
                      <input 
                        type="time" 
                        value={editTimeTo}
                        onChange={(e) => setEditTimeTo(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  <div className="edit-form-group">
                    <label>Trending Tag</label>
                    <select 
                      value={editTrendingTag}
                      onChange={(e) => setEditTrendingTag(e.target.value)}
                    >
                      <option value="">-- No Tag --</option>
                      <option value="★ Now Trending 🔥">★ Now Trending 🔥</option>
                      <option value="⚡ Selling Fast">⚡ Selling Fast</option>
                      <option value="🎟️ Instant Booking">🎟️ Instant Booking</option>
                      <option value="🎭 Popular Play">🎭 Popular Play</option>
                      <option value="🎡 Kids Special">🎡 Kids Special</option>
                      <option value="💻 Tech Hub">💻 Tech Hub</option>
                      <option value="🚀 Developer Choice">🚀 Developer Choice</option>
                    </select>
                  </div>
                  <div className="edit-form-group">
                    <label>Banner Image URL</label>
                    <input 
                      type="text" 
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="Paste image URL or upload below"
                    />
                  </div>
                  <div className="edit-form-group">
                    <label>Upload Image File</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleEditImageFileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="edit-form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 className="edit-sub-title">Ticket Pricing Tiers</h4>
                  <button type="button" className="add-tier-btn" onClick={handleAddEditTier}>
                    + Add Tier
                  </button>
                </div>
                {editTicketTiers.map((tier, index) => (
                  <div key={index} className="edit-tier-row">
                    <input 
                      type="text" 
                      placeholder="Tier Name" 
                      value={tier.name}
                      onChange={(e) => handleEditTierChange(index, 'name', e.target.value)}
                      required 
                      className="edit-tier-input"
                    />
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      value={tier.capacity || ''}
                      onChange={(e) => handleEditTierChange(index, 'capacity', e.target.value)}
                      required 
                      className="edit-tier-input"
                    />
                    <input 
                      type="number" 
                      placeholder="Price (LKR)" 
                      value={tier.price || ''}
                      onChange={(e) => handleEditTierChange(index, 'price', e.target.value)}
                      required 
                      className="edit-tier-input"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveEditTier(index)}
                      className="remove-tier-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="edit-form-section">
                <h4 className="edit-sub-title">Early Bird Discount</h4>
                <div className="edit-discount-row">
                  <div className="edit-form-group half">
                    <label>Discount %</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 10" 
                      value={editEarlyBirdDiscount || ''}
                      onChange={(e) => setEditEarlyBirdDiscount(e.target.value)} 
                    />
                  </div>
                  <div className="edit-form-group half">
                    <label>Applicable for first X tickets</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50" 
                      value={editEarlyBirdLimit || ''}
                      onChange={(e) => setEditEarlyBirdLimit(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="edit-form-actions">
                <button type="button" className="cancel-edit-btn" onClick={() => setShowEditForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="update-event-btn" disabled={editLoading}>
                  {editLoading ? 'Updating...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        )}

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