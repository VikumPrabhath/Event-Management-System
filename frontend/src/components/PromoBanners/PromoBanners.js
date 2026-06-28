import React from 'react';
import './PromoBanners.css';

function PromoBanners({ onSelectEvent }) {
  return (
    <section className="promo-banners-section">
      <div className="promo-container">
        <h2 className="promo-section-title">
          <span className="fire-icon">🔥</span> FEATURED SPOTLIGHTS & DEALS
        </h2>

        <div className="banners-grid">
          {/* Large Main Banner */}
          <div 
            className="large-promo-banner"
            onClick={() => onSelectEvent && onSelectEvent({
              title: 'COLOMBO MEGA MUSIC FESTIVAL 2026',
              date: '28, AUGUST 2026',
              venue: 'Galle Face Green Arena',
              price: 'LKR 6,500 Upwards'
            })}
          >
            <div className="banner-badge">FEATURED HEADLINER</div>
            <div className="banner-content-box">
              <span className="banner-tag">🎵 LIVE CONCERT EXPERIENCE</span>
              <h3 className="banner-title">COLOMBO MEGA MUSIC FESTIVAL</h3>
              <p className="banner-sub">Featuring 12 Top Sri Lankan Bands & International DJs Live on 3 Stages!</p>
              <div className="banner-footer">
                <span className="banner-date">📅 28 AUG 2026 • GALLE FACE GREEN</span>
                <button className="banner-btn">Get VIP Passes &rsaquo;</button>
              </div>
            </div>
          </div>

          {/* Small Banners Column */}
          <div className="small-banners-col">
            <div 
              className="small-promo-banner banner-sports"
              onClick={() => onSelectEvent && onSelectEvent({
                title: 'ISLAND RUGBY CHAMPIONSHIP FINALS',
                date: '15, JULY 2026',
                venue: 'CR&FC Grounds Colombo',
                price: 'LKR 1,200 Upwards'
              })}
            >
              <span className="small-badge">🏆 SPORTS EXTRAVAGANZA</span>
              <h4>ISLAND RUGBY FINALS</h4>
              <p>CR&FC vs Kandy SC • Live Stadium Action</p>
              <span className="small-link">Book Match Tickets &rsaquo;</span>
            </div>

            <div 
              className="small-promo-banner banner-theatre"
              onClick={() => onSelectEvent && onSelectEvent({
                title: 'ROMEO & JULIET CLASSICAL DRAMA',
                date: '05, SEPTEMBER 2026',
                venue: 'Lionel Wendt Theatre',
                price: 'LKR 2,500 Upwards'
              })}
            >
              <span className="small-badge badge-purple">🎭 DRAMA & ART</span>
              <h4>ROMEO & JULIET LIVE</h4>
              <p>Exclusive 3-Night Theatre Special</p>
              <span className="small-link">Reserve Front Seats &rsaquo;</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default PromoBanners;
