import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EventsMegaMenu from '../../components/EventsMegaMenu/EventsMegaMenu';
import './UserDashboard.css';

function UserDashboard({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' or 'edit-profile'
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const currentUser = user || {
    id: 'anonymous',
    name: 'Quick Take',
    email: 'quicktake611@gmail.com',
    phone: '+1 234 567 890',
    authProvider: 'Google',
    joinedDate: 'Jun 2026',
    eventsAttended: 0
  };

  // Edit Profile Form state
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Bookings list state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    // Sync inputs if user changes
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
  }, [user]);

  useEffect(() => {
    if (currentUser?.id && currentUser.id !== 'anonymous') {
      setLoadingBookings(true);
      fetch(`http://localhost:8081/api/bookings/history/${currentUser.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load bookings');
          return res.json();
        })
        .then(data => {
          setBookings(data);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setLoadingBookings(false);
        });
    }
  }, [currentUser?.id]);

  const handleLogout =async () => {
    try {
          await fetch('http://localhost:8081/api/auth/logout', {
          method: 'POST',
          credentials: 'include', // Send session cookie
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      if (onLogout) {
        onLogout();
      }
      navigate('/');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (currentUser.id === 'anonymous') {
      alert('Cannot update guest profile.');
      return;
    }
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      firstName,
      lastName,
      email,
      mobileNo: phone
    };

    try {
      const res = await fetch(`http://localhost:8081/api/users/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Failed to update profile');
      }

      const updatedData = await res.json();
      if (onUpdateUser) {
        onUpdateUser({
          ...currentUser,
          name: `${updatedData.firstName} ${updatedData.lastName}`.trim(),
          email: updatedData.email,
          phone: updatedData.mobileNo
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Error updating profile');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus !== 'All' && b.status !== filterStatus) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = b.eventTitle?.toLowerCase().includes(term);
      const matchesId = b.id?.toLowerCase().includes(term);
      return matchesTitle || matchesId;
    }
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="dashboard-header" style={{position: 'relative'}}>
        <div className="nav-left">
          <Link to="/" className="brand-logo-link">
            {imgError ? (
              <div className="logo-fallback">
                <span className="logo-sell" style={{color: '#fff'}}>sell</span>
                <span className="logo-out" style={{color: '#ff6a13'}}>out</span>
              </div>
            ) : (
              <img 
                src="/assets/sellout.png" 
                alt="sellout logo" 
                style={{height: '36px', objectFit: 'contain'}}
                onError={() => setImgError(true)}
              />
            )}
          </Link>
          <nav className="header-nav-links">
            <div className="nav-dropdown" onClick={() => setShowMegaMenu(!showMegaMenu)} style={{cursor: 'pointer'}}>
              <span>Events {showMegaMenu ? '⌃' : '▾'}</span>
            </div>
            <Link to="/" className="nav-item">Concerts</Link>
            <Link to="/" className="nav-item">Art & Drama</Link>
            <Link to="/" className="nav-item">Sport & Adventure</Link>
            <Link to="/" className="nav-item">Family & Others</Link>
          </nav>
        </div>
        <div className="nav-right">
          <button className="offers-btn">
            Offers
          </button>
          <button className="logout-btn" onClick={handleLogout} title="Sign Out">
            Logout
          </button>
        </div>
        <EventsMegaMenu isOpen={showMegaMenu} onClose={() => setShowMegaMenu(false)} />
      </header>

      {/* Main Content Area */}
      <div className="dashboard-body">
        {/* Left Side Profile Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="avatar-wrapper">
              <div className="user-avatar">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'Q'}
              </div>
            </div>
            <h2 className="user-display-name">{currentUser.name}</h2>
            <p className="user-email-text">{currentUser.email}</p>
            <div className="meta-tag">
              <span>Member since {currentUser.joinedDate || 'Jun 2026'}</span>
              <span className="dot-separator">•</span>
              <span className="auth-provider-badge">{currentUser.authProvider || 'Google'}</span>
            </div>

            {/* Events Attended Stats */}
            <div className="stat-box events-stat-box">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
                  <path d="M13 5v2"/><path d="M13 11v2"/><path d="M13 17v2"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">{bookings.length}</div>
                <div className="stat-label">Events Booked</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Workspace Main View */}
        <main className="dashboard-main">
          {/* Dashboard Main Tabs */}
          <div className="dashboard-tabs">
            <button 
              className={`dash-tab ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              Tickets
            </button>
            <button 
              className={`dash-tab ${activeTab === 'edit-profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit-profile')}
            >
              Edit Profile
            </button>
          </div>

          {activeTab === 'tickets' ? (
            <div className="tickets-tab-content">
              {/* Search & Sort Controls Bar */}
              <div className="controls-row">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search by event, venue or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="tickets-search-input"
                  />
                </div>
                <button className="sort-dropdown-btn">
                  ↑↓ Newest
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="filter-chips">
                {['All', 'Confirmed', 'Expired', 'Cancelled'].map(status => (
                  <button 
                    key={status}
                    className={`chip ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <section className="tickets-section">
                <div className="section-header">
                  <h3>My Tickets</h3>
                  <span className="ticket-count-tag">{filteredBookings.length} {filteredBookings.length === 1 ? 'Ticket' : 'Tickets'}</span>
                </div>

                {loadingBookings ? (
                  <div style={{color: '#a0a5b5', padding: '20px 0'}}>Loading your bookings...</div>
                ) : filteredBookings.length === 0 ? (
                  /* Empty State Card matching screenshot */
                  <div className="empty-state-card">
                    <div className="empty-illustration">
                      {/* SVG Illustration simulating box holder */}
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="#f39c12" opacity="0.2" />
                        <path d="M35 30 H65 V70 H35 Z" fill="#ff7979" rx="4" />
                        <path d="M30 40 L50 25 L70 40 L50 55 Z" fill="#ffbe76" />
                        <circle cx="50" cy="55" r="8" fill="#6c5ce7" />
                      </svg>
                    </div>
                    <h4>No bookings found</h4>
                    <p>No tickets found matching current filters. Browse events and book your next experience!</p>
                    <button className="explore-btn" onClick={() => navigate('/')}>
                      Explore Events
                    </button>
                  </div>
                ) : (
                  <div className="bookings-grid">
                    {filteredBookings.map(b => (
                      <div key={b.id || Math.random().toString()} className="booking-card">
                        <div className="booking-card-header">
                          <h4 className="booking-event-title-display">{b.eventTitle || 'Event Ticket'}</h4>
                          <span className={`booking-status-badge ${b.status ? b.status.toLowerCase() : 'confirmed'}`}>
                            {b.status || 'Confirmed'}
                          </span>
                        </div>
                        <div className="booking-card-details">
                          {b.selectedTiers && Object.entries(b.selectedTiers).map(([tierName, qty]) => {
                            if (qty > 0) {
                              return <div key={tierName}><span>{tierName}:</span> <span>{qty}</span></div>;
                            }
                            return null;
                          })}
                          {b.paymentMethod && <div><span>Payment Method:</span> <span>{b.paymentMethod.toUpperCase()}</span></div>}
                          {b.id && <div><span>Booking ID:</span> <span>#{b.id.substring(b.id.length - 8).toUpperCase()}</span></div>}
                        </div>
                        <div className="booking-card-footer">
                          <span className="booking-date-display">
                            {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="booking-amount-display">
                            {b.totalAmount ? b.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'} LKR
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : (
            /* Edit Profile Tab View */
            <div className="edit-profile-content">
              <h3>Edit Profile</h3>
              {saveSuccess && <div className="success-banner">Profile updated successfully!</div>}
              <form onSubmit={handleSaveProfile} className="edit-profile-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                    />
                  </div>
                  <div className="form-field">
                    <label>Authentication Provider</label>
                    <input 
                      type="text" 
                      value={currentUser.authProvider || 'Google'} 
                      disabled 
                      style={{opacity: 0.6}}
                    />
                  </div>
                </div>
                <button type="submit" className="save-profile-btn">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
