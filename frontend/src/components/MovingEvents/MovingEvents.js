import React from 'react';
import './MovingEvents.css';

function MovingEvents({ onSelectEvent }) {
  const trendingEvents = [
    {
      id: 'marians-edge',
      title: 'Marians Live at the Edge',
      date: '17 May 2026',
      venue: 'Lotus Tower Colombo',
      badge: '🔥 HOT EVENT',
      badgeClass: 'badge-hot',
      price: 'LKR 4,000 Upwards',
      bgGradient: 'linear-gradient(135deg, #FF416C, #FF4B2B)'
    },
    {
      id: 'aaradhana-wayo',
      title: 'AARADHANA BY WAYO',
      date: '25 Nov 2026',
      venue: 'Viharamahadevi Outdoor Stage',
      badge: '⚡ SELLING FAST',
      badgeClass: 'badge-fast',
      price: 'LKR 3,500 Upwards',
      bgGradient: 'linear-gradient(135deg, #8A2387, #E94057, #F27121)'
    },
    {
      id: 'kasun-kalhara',
      title: 'Love in Concert - Kasun Kalhara',
      date: '03 July 2026',
      venue: 'Nelum Pokuna Theater',
      badge: '🎟️ INSTANT BOOKING',
      badgeClass: 'badge-instant',
      price: 'LKR 5,000 Upwards',
      bgGradient: 'linear-gradient(135deg, #4AC29A, #BDFFF3)'
    },
    {
      id: 'shina-nayagara',
      title: 'Shina Nayagara Live',
      date: '12 Aug 2026',
      venue: 'Lotus Tower Open Arena',
      badge: '🌟 POPULAR',
      badgeClass: 'badge-popular',
      price: 'LKR 8,990 Upwards',
      bgGradient: 'linear-gradient(135deg, #4776E6, #8E54E9)'
    }
  ];

  // Duplicate list to ensure seamless infinite looping marquee
  const marqueeItems = [...trendingEvents, ...trendingEvents];

  return (
    <div className="moving-events-section">
      <div className="section-header-ticker">
        <span className="live-pulse"></span>
        <h3 className="ticker-title">LIVE TRENDING EVENTS &nbsp;•&nbsp; INSTANT TICKET UPDATES</h3>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-track">
          {marqueeItems.map((event, index) => (
            <div 
              key={`${event.id}-${index}`} 
              className="moving-card"
              onClick={() => onSelectEvent && onSelectEvent(event)}
            >
              <div className="moving-card-banner" style={{ background: event.bgGradient }}>
                <span className={`moving-badge ${event.badgeClass}`}>{event.badge}</span>
                <div className="moving-card-icon">🎟️</div>
              </div>
              <div className="moving-card-content">
                <h4 className="moving-event-title">{event.title}</h4>
                <p className="moving-event-venue">📍 {event.venue}</p>
                <div className="moving-card-footer">
                  <span className="moving-event-date">📅 {event.date}</span>
                  <span className="moving-event-price">{event.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovingEvents;
