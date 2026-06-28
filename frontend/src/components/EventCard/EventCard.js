import React from 'react';
import './EventCard.css';

function EventCard({ event, onSelectEvent, onClick, compactMode = false }) {
  const defaultEvent = {
    id: 'shina-nayagara',
    date: 'FRI, JUL 24, 2026',
    time: 'Doors 7:00 PM',
    title: 'Musaeus College Auditorium',
    category: 'Sumihiri Mathakayan Concert',
    price: 'LKR 4,000.00',
    countdown: '26d : 07h : 38m',
    trendingTag: '★ Now Trending 🔥'
  };

  // If AdminDashboard passes a different structure, adapt it or use default
  const data = {
    ...defaultEvent,
    ...event,
    title: event?.title || defaultEvent.title,
    category: event?.type || event?.category || defaultEvent.category,
    date: event?.date || defaultEvent.date,
    price: event?.price || defaultEvent.price,
  };

  const handleClick = () => {
    if (onClick) onClick(data);
    else if (onSelectEvent) onSelectEvent(data);
  };

  return (
    <div className={`event-card-modern ${compactMode ? 'compact-card' : ''}`} onClick={handleClick}>
      
      {/* Poster Image Area */}
      <div className="card-poster-area" style={event?.image ? {backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}>
        {!event?.image && (
          <div className="poster-inner-graphic">
            <span className="graphic-icon">🎤</span>
          </div>
        )}

        {/* Pop-out countdown badge on image bottom border */}
        <div className="card-popout-timer">
          <span className="timer-icon">⏰</span>
          <div className="timer-info">
            <label>STARTS IN</label>
            <strong>{data.countdown || '18d : 12h : 45m'}</strong>
          </div>
        </div>
      </div>

      {/* Card Details Area */}
      <div className="card-details-area">
        <div className="card-header-date">{data.date}</div>
        <h3 className="card-main-title">{data.title}</h3>
        <p className="card-sub-title">{data.category}</p>

        <div className="card-price-row">
          <div className="price-label-box">
            <span className="from-text">FROM</span>
            <span className="price-value">{data.price}</span>
          </div>
        </div>
      </div>

      {/* Pop-out trending badge at bottom right corner */}
      <div className="card-popout-corner-badge">
        {data.trendingTag || '★ Now Trending 🔥'}
      </div>

    </div>
  );
}

export default EventCard;
