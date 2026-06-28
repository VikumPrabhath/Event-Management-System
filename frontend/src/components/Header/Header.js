import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onSearch, theme, toggleTheme, isAdminView }) {
  const [imgError, setImgError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogoError = () => {
    setImgError(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <header className={`header ${theme === 'dark' ? 'dark-header' : ''}`}>
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
            <a href="#concerts" className="nav-link">Concerts</a>
            <a href="#theater" className="nav-link">Theater</a>
            <Link to="/admin" className="nav-link">Login</Link>
          </nav>

          <div className="cta-container">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button className="book-ticket-btn">Book Ticket</button>
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
    </header>
  );
}

export default Header;
