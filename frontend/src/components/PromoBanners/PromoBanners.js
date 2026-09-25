import React, { useState, useEffect } from 'react';
import './PromoBanners.css';

function PromoBanners({ events = [], onSelectEvent }) {
  if (events.length === 0) return null;

  const mainEvent = events[0];
  const secondEvent = events.length > 1 ? events[1] : null;
  const thirdEvent = events.length > 2 ? events[2] : null;

  return (
    <section id="featured-spotlights-section" className="promo-banners-section">
      <div className="promo-container">
        <h2 className="promo-section-title">
          <span className="fire-icon">🔥</span> FEATURED SPOTLIGHTS & DEALS
        </h2>

        <div className="banners-grid">
          {/* Large Main Banner */}
          {mainEvent && (
            <div 
              className="large-promo-banner"
              style={mainEvent.imageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url(${mainEvent.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              onClick={() => onSelectEvent && onSelectEvent(mainEvent)}
            >
              <div className="banner-badge">FEATURED HEADLINER</div>
              <div className="banner-content-box">
                <span className="banner-tag">
                  {mainEvent.category === 'music' ? '🎵 CONCERT & MUSIC' : mainEvent.category === 'sports' ? '🏆 SPORTS & ADVENTURE' : mainEvent.category === 'drama' ? '🎭 ART & DRAMA' : '🎡 FAMILY & OTHERS'}
                </span>
                <h3 className="banner-title">{mainEvent.title}</h3>
                <p className="banner-sub">{mainEvent.description}</p>
                <div className="banner-footer">
                  <span className="banner-date">
                    📅 {mainEvent.date ? new Date(mainEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'UPCOMING'} • {mainEvent.venue || 'ONLINE'}
                  </span>
                  <button className="banner-btn">Book Tickets &rsaquo;</button>
                </div>
              </div>
            </div>
          )}

          {/* Small Banners Column */}
          <div className="small-banners-col">
            {secondEvent && (
              <div 
                className="small-promo-banner banner-sports"
                style={secondEvent.imageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.85)), url(${secondEvent.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                onClick={() => onSelectEvent && onSelectEvent(secondEvent)}
              >
                <span className="small-badge">
                  {secondEvent.category === 'music' ? '🎵 CONCERT & MUSIC' : secondEvent.category === 'sports' ? '🏆 SPORTS & ADVENTURE' : secondEvent.category === 'drama' ? '🎭 ART & DRAMA' : '🎡 FAMILY & OTHERS'}
                </span>
                <h4>{secondEvent.title}</h4>
                <p>{secondEvent.venue}</p>
                <span className="small-link">Book Tickets &rsaquo;</span>
              </div>
            )}

            {thirdEvent && (
              <div 
                className="small-promo-banner banner-theatre"
                style={thirdEvent.imageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.85)), url(${thirdEvent.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                onClick={() => onSelectEvent && onSelectEvent(thirdEvent)}
              >
                <span className="small-badge badge-purple">
                  {thirdEvent.category === 'music' ? '🎵 CONCERT & MUSIC' : thirdEvent.category === 'sports' ? '🏆 SPORTS & ADVENTURE' : thirdEvent.category === 'drama' ? '🎭 ART & DRAMA' : '🎡 FAMILY & OTHERS'}
                </span>
                <h4>{thirdEvent.title}</h4>
                <p>{thirdEvent.venue}</p>
                <span className="small-link">Book Tickets &rsaquo;</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default PromoBanners;
