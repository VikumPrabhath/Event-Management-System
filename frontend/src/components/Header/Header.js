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
            <img 
              src="/assets/sellout.png" 
              alt="sellout logo" 
              className="logo-img" 
              onError={handleLogoError}
            />
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
              <Link to="/dashboard" className="nav-link user-dash-link">
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
          <div className="admin-header-title">Admin Dashboard</div>
          <div className="admin-profile">
            <div className="admin-avatar">👤</div>
            <span className="admin-welcome">Welcome Admin</span>
            <button className="theme-toggle-btn admin-theme-btn" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </>
      )}
      <EventsMegaMenu isOpen={showMegaMenu} onClose={() => setShowMegaMenu(false)} />
    </header>
  );
}

export default Header;
