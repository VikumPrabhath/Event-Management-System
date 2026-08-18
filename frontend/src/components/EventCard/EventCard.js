import React from 'react';
import './EventCard.css';

function EventCard({ event, onSelectEvent, onClick, compactMode = false }) {
  const getCountdown = (dateString) => {
    if (!dateString) return 'Upcoming';
    const eventTime = new Date(dateString).getTime();
    if (isNaN(eventTime)) return 'Upcoming';
    
    const now = new Date().getTime();
    const distance = eventTime - now;
    
    if (distance < 0) {
      return 'Started / Ended';
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d : ${hours}h : ${minutes}m`;
  };

  // Map properties strictly depending on the API response
  const data = {
    ...event,
    title: event?.title || '',
    category: event?.category || event?.type || '',
    date: event?.date ? (isNaN(Date.parse(event.date)) ? event.date : new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()) : '',
    price: event?.price || (event?.ticketTiers && event.ticketTiers.length > 0 ? `LKR ${event.ticketTiers[0].price.toLocaleString()}` : ''),
    countdown: getCountdown(event?.date),
    trendingTag: event?.trendingTag || '',
    image: event?.imageUrl || event?.image || ''
  };

  // Calculate remaining tickets
  let remainingTickets = null;
  if (data.totalCapacity !== undefined && data.ticketsSold !== undefined) {
    remainingTickets = data.totalCapacity - data.ticketsSold;
    if (remainingTickets < 0) remainingTickets = 0;
  }

  const handleClick = () => {
    if (onClick) onClick(data);
    else if (onSelectEvent) onSelectEvent(data);
  };

  // Get the image source
  const imageSrc = data.image || '/assets/default-event.jpg';

  return (
    <div className={`event-card-modern ${compactMode ? 'compact-card' : ''}`} onClick={handleClick}>
      
      {/* Poster Image Area */}
      <div className="card-poster-area" style={imageSrc ? {backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}>
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

        <div className="card-price-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
          <div className="price-label-box">
            <span className="from-text">FROM</span>
            <span className="price-value">{data.price}</span>
          </div>
          
          {data.earlyBirdDiscount > 0 && (
            <div style={{ color: '#00ff80', fontSize: '11px', fontWeight: 'bold' }}>
              🌟 {data.earlyBirdDiscount}% Early Bird Off!
            </div>
          )}
          
          {remainingTickets !== null && (
            <div style={{ color: '#ff6a13', fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>
              🎟️ Remaining: {remainingTickets}
              {remainingTickets === 0 && <span style={{ color: 'red', marginLeft: '5px' }}>SOLD OUT</span>}
            </div>
          )}
        </div>
      </div>

      {/* Pop-out trending badge at bottom right corner */}
      {data.trendingTag && (
        <div className="card-popout-corner-badge">
          {data.trendingTag}
        </div>
      )}

    </div>
  );
}

export default EventCard;
