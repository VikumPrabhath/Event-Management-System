import React, { useState } from 'react';
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

  // Edit Profile Form state
  const [name, setName] = useState(user?.name || 'Quick Take');
  const [email, setEmail] = useState(user?.email || 'quicktake611@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+1 234 567 890');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentUser = user || {
    name: 'Quick Take',
    email: 'quicktake611@gmail.com',
    authProvider: 'Google',
    joinedDate: 'Jun 2026',
    eventsAttended: 0
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        name,
        email,
        phone
      });
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
          <button className="logout-btn" onClick={onLogout} title="Sign Out">
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
                <div className="stat-number">{currentUser.eventsAttended || 0}</div>
                <div className="stat-label">Events Attended</div>
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

              {/* Upcoming Events Section */}
              <section className="tickets-section">
                <div className="section-header">
                  <h3>Upcoming Events Tickets</h3>
                  <span className="ticket-count-tag">0 Tickets</span>
                </div>

                {/* Empty State Card matching screenshot */}
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
                  <h4>No upcoming events</h4>
                  <p>You don't have any upcoming tickets. Browse events and book your next experience!</p>
                  <button className="explore-btn" onClick={() => navigate('/')}>
                    Explore Events
                  </button>
                </div>
              </section>

              {/* Past Events Section */}
              <section className="tickets-section past-section">
                <div className="section-header">
                  <h3>Past Events Tickets</h3>
                  <span className="ticket-count-tag">0 Tickets</span>
                </div>
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
