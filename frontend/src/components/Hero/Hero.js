import React, { useState } from 'react';
import './Hero.css';

function Hero({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Let's Book Your Ticket</h1>
        <p className="hero-subtitle">
          Book live events and discover concerts, events, theater and more.
        </p>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Hero;
