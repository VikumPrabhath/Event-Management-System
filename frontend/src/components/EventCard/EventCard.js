import React from 'react';
import './EventCard.css';

function EventCard({ event }) {
  // Default fallback data matching the screenshot
  const defaultEvent = {
    date: '3, July 2026',
    time: '7:00 PM',
    title: 'Shina Nayagara Lotus Tower Colombo',
    category: 'Out Door Musical Event',
    price: 'LKR 8,990 Upwards'
  };

  const data = event || defaultEvent;

  return (
    <div className="event-card">
      <div className="event-image-placeholder">
        <div className="placeholder-icon">🎵</div>
        <span className="placeholder-text">Event Poster Placeholder</span>
      </div>
      <div className="event-details">
        <div className="event-time-info">
          <span className="event-date">{data.date}</span>
          <span className="event-divider">•</span>
          <span className="event-time">{data.time}</span>
        </div>
        <h3 className="event-title">{data.title}</h3>
        <p className="event-category">{data.category}</p>
        <div className="event-footer">
          <span className="event-price">{data.price}</span>
          <button className="book-btn">Book</button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
