import React from 'react';
import './MeetupCard.css';

function MeetupCard({ event, onSelectEvent }) {
  // Calculate remaining tickets
  let remainingTickets = null;
  if (event.totalCapacity !== undefined && event.ticketsSold !== undefined) {
    remainingTickets = event.totalCapacity - event.ticketsSold;
    if (remainingTickets < 0) remainingTickets = 0;
  }

  return (
    <div className="meetup-card" onClick={() => onSelectEvent(event)}>
      <div className="meetup-image-wrapper">
        <img src={event.image || '/assets/default-event.jpg'} alt={event.title} className="meetup-image" />
        <div className="meetup-category-badge">
          {event.category || 'Tech Meetup'}
        </div>
      </div>
      <div className="meetup-details">
        {event.trendingTag && <span className="meetup-trending-tag">{event.trendingTag}</span>}
        <h3 className="meetup-title">{event.title}</h3>
        
        <div className="meetup-meta-row">
          <span className="meetup-meta-icon">📅</span>
          <span className="meetup-meta-text">{event.date} • {event.time}</span>
        </div>
        
        <div className="meetup-meta-row">
          <span className="meetup-meta-icon">📍</span>
          <span className="meetup-meta-text">{event.venue || 'TBA'}</span>
        </div>

        {event.earlyBirdDiscount > 0 && (
          <div style={{ color: '#00ff80', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>
            🌟 {event.earlyBirdDiscount}% Early Bird Off!
          </div>
        )}
        
        {remainingTickets !== null && (
          <div style={{ color: '#ff6a13', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
            🎟️ Remaining: {remainingTickets}
            {remainingTickets === 0 && <span style={{ color: 'red', marginLeft: '5px' }}>SOLD OUT</span>}
          </div>
        )}

        <div className="meetup-footer">
          <div className="meetup-price-box">
            <span className="price-label">Entry</span>
            <span className="price-value">{event.price}</span>
          </div>
          <button className="meetup-book-btn">RSVP Now &gt;</button>
        </div>
      </div>
    </div>
  );
}

export default MeetupCard;
