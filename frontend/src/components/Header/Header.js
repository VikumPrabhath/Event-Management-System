import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EventsMegaMenu from '../EventsMegaMenu/EventsMegaMenu';
import './Header.css';

function Header({ onSearch, theme, toggleTheme, isAdminView, user, onOpenAuth }) {
  const [imgError, setImgError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const handleLogoError = () => {
    setImgError(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <header className={`header ${theme === 'dark' ? 'dark-header' : ''}`} style={{position: 'relative'}}>
      <div className="logo-container">
        <Link to="/" style={{ textDecoration: 'none' }}>
          {imgError ? (
            <div className="logo-fallback">
              <span className="logo-sell">sell</span>
              <span className="logo-out">out</span>
            </div>
          ) : (
            <div className="logo-wrapper">
              <img 
                src="/assets/sellout.png" 
                alt="sellout logo" 
                className="logo-img" 
                onError={handleLogoError}
              />
            </div>
          )}
        </Link>
      </div>

      {!isAdminView ? (
        <>
          {/* Integrated Search Bar in Header */}
          <form onSubmit={handleSearchSubmit} className="header-search-form">
            <span className="header-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search concerts, theater..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="header-search-input"
            />
          </form>
          
          <nav className="nav-menu">
            <button 
              className="nav-link nav-dropdown-trigger" 
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              style={{background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit'}}
            >
              Events {showMegaMenu ? '⌃' : '▾'}
            </button>
            <a href="#concerts" className="nav-link">Concerts</a>
            <a href="#theater" className="nav-link">Theater</a>
            {user ? (
              <Link to={user.role === 'Organizer' ? "/organizer/dashboard" : "/dashboard"} className="nav-link user-dash-link">
                My Dashboard
              </Link>
            ) : (
              <button onClick={onOpenAuth} className="nav-link nav-auth-btn">
                Sign In / Register
              </button>
            )}
          </nav>

          <div className="cta-container">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            {user ? (
              <Link to="/dashboard" className="book-ticket-btn" style={{textDecoration: 'none'}}>
                My Tickets
              </Link>
            ) : (
              <button className="book-ticket-btn" onClick={onOpenAuth}>
                Book Ticket
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="admin-header-title">
            {user?.role === 'Organizer' ? `${user.name || 'Organizer'} Dashboard` : 'Admin Dashboard'}
          </div>
          <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="admin-avatar">👤</div>
            <span className="admin-welcome">
              {user?.role === 'Organizer' ? `Welcome ${user.name || 'Organizer'}` : 'Welcome Admin'}
            </span>
            <button className="theme-toggle-btn admin-theme-btn" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('admin_authenticated', 'false');
                window.location.href = '/admin';
              }}
              style={{ background: 'transparent', border: '1px solid #2a2d3d', color: '#8b90a0', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
            >
              Logout
            </button>
          </div>
        </>
      )}
      <EventsMegaMenu isOpen={showMegaMenu} onClose={() => setShowMegaMenu(false)} />
    </header>
  );
}

export default Header;