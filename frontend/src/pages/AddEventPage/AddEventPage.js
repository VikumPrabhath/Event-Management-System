import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AddEventPage.css';

function AddEventPage({ theme, toggleTheme, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('music');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('18:00');
  const [timeTo, setTimeTo] = useState('22:00');
  const [trendingTag, setTrendingTag] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ticket Tiers State (default with Gold and Platinum)
  const [ticketTiers, setTicketTiers] = useState([
    { name: 'Gold', capacity: 100, price: 5000 },
    { name: 'Platinum', capacity: 50, price: 7500 }
  ]);

  // Discounts
  const [earlyBirdDiscount, setEarlyBirdDiscount] = useState(0);
  const [earlyBirdLimit, setEarlyBirdLimit] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract date from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      setEventDate(dateParam);
    }
  }, [location]);

  const handleAddTier = () => {
    setTicketTiers([...ticketTiers, { name: '', capacity: 0, price: 0 }]);
  };

  const handleRemoveTier = (index) => {
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...ticketTiers];
    if (field === 'capacity') {
      updated[index].capacity = parseInt(value) || 0;
    } else if (field === 'price') {
      updated[index].price = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setTicketTiers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (ticketTiers.length === 0) {
      setErrorMsg('Please add at least one ticket tier.');
      setLoading(false);
      return;
    }

    const payload = {
      title: eventName,
      category: category,
      description: description,
      venue: venue,
      date: eventDate,
      timeFrom: timeFrom,
      timeTo: timeTo,
      imageUrl: imageUrl || '/assets/default-event.jpg',
      trendingTag: trendingTag,
      ticketTiers: ticketTiers,
      earlyBirdDiscount: parseFloat(earlyBirdDiscount) || 0.0,
      earlyBirdLimit: parseInt(earlyBirdLimit) || 0,
      organizerId: user?.role === 'Organizer' ? user.id : null
    };

    try {
      const res = await fetch('http://localhost:8081/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to create event.');
      }

      navigate(user?.role === 'Organizer' ? '/organizer/dashboard' : '/admin');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred while saving event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-portal-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
      
      <main className="add-event-page-container">
        <div className="add-event-header">
          <button className="back-btn" onClick={() => navigate(user?.role === 'Organizer' ? '/organizer/dashboard' : '/admin')}>← Back to Dashboard</button>
          <h2 className="page-title">Add New Event</h2>
        </div>
        
        {errorMsg && <div className="error-banner" style={{color: '#ff7979', marginBottom: '20px'}}>{errorMsg}</div>}

        <form className="add-event-form" onSubmit={handleSubmit}>
          
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              {/* Section: Event Details */}
              <div className="form-section">
                <h3 className="section-title">Event Details</h3>
                <div className="form-row">
                  <label>Event Name</label>
                  <input 
                    type="text" 
                    placeholder="Event Name" 
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-row">
                  <label>Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="music">Concert & Music</option>
                    <option value="drama">Art & Drama</option>
                    <option value="sports">Sport & Adventure</option>
                    <option value="family">Family & Others</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Description</label>
                  <textarea 
                    placeholder="Description" 
                    rows="4" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-row">
                  <label>Status / Trending Badge</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ★ Now Trending 🔥" 
                    value={trendingTag}
                    onChange={(e) => setTrendingTag(e.target.value)}
                  />
                </div>
              </div>

              {/* Section: Time And Place */}
              <div className="form-section">
                <h3 className="section-title">Time And Place</h3>
                <div className="form-row">
                  <label>Venue Name / Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lotus Tower, Colombo" 
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                  />
                </div>
                {venue && (
                  <div className="form-row" style={{ marginTop: '10px' }}>
                    <iframe
                      title="Location Map Preview"
                      width="100%"
                      height="200"
                      style={{ border: 0, borderRadius: '8px' }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(venue)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                )}
                <div className="form-row multi-col">
                  <label>Date & Time</label>
                  <div className="date-time-inputs">
                    <input 
                      type="date" 
                      required 
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                    <div className="time-group">
                      <span className="time-label">From</span>
                      <input 
                        type="time" 
                        value={timeFrom}
                        onChange={(e) => setTimeFrom(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="time-group">
                      <span className="time-label">To</span>
                      <input 
                        type="time" 
                        value={timeTo}
                        onChange={(e) => setTimeTo(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              {/* Section: Uploads */}
              <div className="form-section">
                <h3 className="section-title">Event Banner Image</h3>
                <div className="form-row">
                  <label style={{ fontSize: '12px', color: '#8b90a0' }}>Upload Local Image File (Converts to Base64)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ background: 'transparent', padding: '8px 0', border: 'none' }}
                  />
                </div>
                <div className="form-row">
                  <label style={{ fontSize: '12px', color: '#8b90a0' }}>Or Paste Image URL / Base64 Data String</label>
                  <input 
                    type="text" 
                    placeholder="data:image/jpeg;base64,... or URL" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                {imageUrl && (
                  <div className="form-row" style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '12px', color: '#8b90a0' }}>Banner Preview:</label>
                    <img 
                      src={imageUrl} 
                      alt="Banner Preview" 
                      style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a2d3d', marginTop: '5px' }} 
                    />
                  </div>
                )}
              </div>

              {/* Section: Ticket Pricing */}
              <div className="form-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="section-title" style={{ margin: 0 }}>Ticket Pricing Tiers</h3>
                  <button type="button" className="choose-img-btn" onClick={handleAddTier} style={{ padding: '6px 12px', fontSize: '12px' }}>
                    + Add Tier
                  </button>
                </div>
                
                {ticketTiers.map((tier, index) => (
                  <div key={index} className="ticket-tier-row" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ flex: 1.5 }}>
                      <input 
                        type="text" 
                        placeholder="Tier Name (e.g. VIP)" 
                        value={tier.name}
                        onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                        required 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <input 
                        type="number" 
                        placeholder="Qty" 
                        value={tier.capacity || ''}
                        onChange={(e) => handleTierChange(index, 'capacity', e.target.value)}
                        required 
                      />
                    </div>
                    <div style={{ flex: 1.2 }}>
                      <input 
                        type="number" 
                        placeholder="Price (LKR)" 
                        value={tier.price || ''}
                        onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                        required 
                      />
                    </div>
                    <div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTier(index)}
                        style={{ background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section: Discounts */}
              <div className="form-section">
                <h3 className="section-title">Early Bird Discount</h3>
                <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Discount %</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 10" 
                      value={earlyBirdDiscount || ''}
                      onChange={(e) => setEarlyBirdDiscount(e.target.value)} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Applicable for first X tickets</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50" 
                      value={earlyBirdLimit || ''}
                      onChange={(e) => setEarlyBirdLimit(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(user?.role === 'Organizer' ? '/organizer/dashboard' : '/admin')}>Cancel</button>
            <button type="submit" className="create-event-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default AddEventPage;
