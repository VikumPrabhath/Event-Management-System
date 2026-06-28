import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './EventDetails.css';

function EventDetails({ event, onBack, onOpenBooking }) {
  const defaultDetails = {
    title: 'AARADHANA BY WAYO',
    date: '25, November 2026',
    time: '6:30 PM Onwards',
    venue: 'Viharamahadevi Outdoor Stage, Colombo',
    organizer: 'Wayo Production (Pvt) Ltd',
    description: 'Experience an unforgettable musical evening with WAYO live in concert! Featuring exclusive live arrangements, energetic band performances, and special guest appearances.'
  };

  const currentEvent = event || defaultDetails;

  // Countdown state simulation
  const [timeLeft, setTimeLeft] = useState({ days: 22, hours: 12, minutes: 35, seconds: 14 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ticketTiers = [
    { name: 'Balcony / General', price: 'LKR 2,000', available: true },
    { name: 'Standard Seating', price: 'LKR 3,500', available: true },
    { name: 'VIP Front Row', price: 'LKR 5,000', available: true }
  ];

  return (
    <div className="event-details-page">
      <Header />

      {/* Hero Banner with Countdown */}
      <div className="event-hero-banner">
        <div className="event-hero-container">
          <button className="back-btn" onClick={onBack}>← Back to Events</button>
          
          <div className="banner-content">
            <div className="banner-poster-placeholder">
              <div className="poster-icon">🎤</div>
              <span>Event Poster</span>
            </div>

            <div className="banner-timer-box">
              <h3>Event will start in</h3>
              <div className="countdown-display">
                <div className="timer-unit"><span>{timeLeft.days}</span><label>Days</label></div>
                <div className="timer-colon">:</div>
                <div className="timer-unit"><span>{timeLeft.hours}</span><label>Hours</label></div>
                <div className="timer-colon">:</div>
                <div className="timer-unit"><span>{timeLeft.minutes}</span><label>Mins</label></div>
                <div className="timer-colon">:</div>
                <div className="timer-unit"><span>{timeLeft.seconds}</span><label>Secs</label></div>
              </div>
              <button className="hero-buy-btn" onClick={() => onOpenBooking(currentEvent)}>
                Buy Ticket Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="event-body-container">
        <div className="details-left">
          <h1 className="details-title">{currentEvent.title}</h1>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">📅</span>
              <div>
                <strong>Date & Time</strong>
                <p>{currentEvent.date} • {currentEvent.time}</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Location / Venue</strong>
                <p>{currentEvent.venue || currentEvent.category}</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🏢</span>
              <div>
                <strong>Organized By</strong>
                <p>{currentEvent.organizer || 'Sellout Official Partners'}</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3>About This Event</h3>
            <p>{currentEvent.description || defaultDetails.description}</p>
          </div>
        </div>

        {/* Right Side Ticket Prices */}
        <div className="details-right">
          <div className="ticket-prices-card">
            <h3>Ticket Categories</h3>
            <div className="tiers-list">
              {ticketTiers.map((tier, idx) => (
                <div key={idx} className="tier-row">
                  <div className="tier-info">
                    <span className="tier-name">{tier.name}</span>
                    <span className="tier-price">{tier.price}</span>
                  </div>
                  <button className="tier-buy-btn" onClick={() => onOpenBooking({ ...currentEvent, selectedTier: tier })}>
                    Buy Ticket
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EventDetails;
