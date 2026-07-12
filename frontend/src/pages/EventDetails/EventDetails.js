import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MapWidget from '../../components/MapWidget/MapWidget';
import './EventDetails.css';

function EventDetails({ onBack, onOpenBooking, theme, toggleTheme, user, onOpenAuth }) {
  const { id } = useParams();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetch(`http://localhost:8081/api/events/${id}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setCurrentEvent(data);
        setLoading(false);
        if (data.organizerId) {
          fetch(`http://localhost:8081/api/users/${data.organizerId}`)
            .then(r => r.json())
            .then(orgData => setOrganizer(orgData))
            .catch(e => console.log('Failed to fetch organizer'));
        }
      })
      .catch(err => {
        console.error("Failed to load event details", err);
        setLoading(false);
      });
  }, [id]);

  // Calculate Remaining Capacity
  let remainingTickets = null;
  if (currentEvent && currentEvent.ticketTiers) {
    const totalCap = currentEvent.ticketTiers.reduce((sum, tier) => sum + tier.capacity, 0);
    remainingTickets = totalCap - (currentEvent.ticketsSold || 0);
    if (remainingTickets < 0) remainingTickets = 0;
  }

  useEffect(() => {
    if (!currentEvent || !currentEvent.date) return;
    const eventTime = new Date(currentEvent.date).getTime();
    if (isNaN(eventTime)) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [currentEvent]);

  if (loading) {
    return <div className={`event-details-page ${theme === 'dark' ? 'dark-theme-details' : 'light-theme-details'}`} style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', color: theme === 'dark' ? '#fff' : '#000'}}><h2>Loading Event Details...</h2></div>;
  }

  if (!currentEvent) {
    return <div className={`event-details-page ${theme === 'dark' ? 'dark-theme-details' : 'light-theme-details'}`} style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', color: theme === 'dark' ? '#fff' : '#000'}}><h2>Event Not Found</h2></div>;
  }

  return (
    <div className={`event-details-page ${theme === 'dark' ? 'dark-theme-details' : 'light-theme-details'}`}>
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onOpenAuth={onOpenAuth} />

      {/* Top Banner & Floating Poster Section */}
      <div className="details-hero-section">
        <div className="hero-cover-bg">
          <div className="cover-overlay"></div>
          {/* Overlapping Square Poster Card on right */}
          <div className="floating-poster-card">
            <div className="poster-inner-img">
              <span className="poster-title-preview">{currentEvent.title}</span>
            </div>
          </div>
        </div>

        {/* Left Countdown Bar underneath hero cover */}
        <div className="countdown-bar-wrapper">
          <div className="countdown-bar-container">
            <div className="bar-left-content">
              <h3 className="countdown-headline">Event <span className="light-sub">will start on</span></h3>
              <div className="countdown-boxes">
                <div className="time-box">
                  <span className="num">{timeLeft.days}</span>
                  <label>DAYS</label>
                </div>
                <div className="time-box">
                  <span className="num">{timeLeft.hours}</span>
                  <label>HOURS</label>
                </div>
                <div className="time-box">
                  <span className="num">{timeLeft.minutes}</span>
                  <label>MINS</label>
                </div>
                <div className="time-box">
                  <span className="num">{timeLeft.seconds}</span>
                  <label>SECS</label>
                </div>
              </div>
              <button className="orange-book-now-btn" onClick={() => onOpenBooking(currentEvent)}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="details-main-body">
        <div className="body-grid-container">
          {/* Left Column Info */}
          <div className="main-info-column">
            <h1 className="event-main-title">{currentEvent.title}</h1>
            <p className="event-subtitle">{currentEvent.type || currentEvent.category}</p>

            <div className="lineup-box">
              <strong>About Event</strong>
              <p>{currentEvent.description || 'Join us for an amazing experience!'}</p>
            </div>

            <div className="event-meta-list">
              <div className="meta-row">
                <span className="meta-bullet">📅</span>
                <span>{currentEvent.date} {currentEvent.timeFrom}</span>
              </div>
              <div className="meta-row">
                <span className="meta-bullet">📍</span>
                <span>{currentEvent.venue || 'TBA'}</span>
              </div>
              <div className="meta-row">
                <span className="meta-bullet">Organized by</span>
                <span>{organizer ? (organizer.companyName || organizer.name) : (currentEvent.organizerId || 'Event Organizer')}</span>
              </div>
            </div>

            {remainingTickets !== null && (
              <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(255, 106, 19, 0.1)', border: '1px solid #ff6a13', borderRadius: '8px' }}>
                <strong style={{ color: '#ff6a13', fontSize: '18px' }}>🎟️ Remaining Tickets: {remainingTickets}</strong>
                {remainingTickets === 0 && <span style={{ marginLeft: '10px', color: 'red', fontWeight: 'bold' }}>SOLD OUT</span>}
              </div>
            )}
            
            {currentEvent.earlyBirdDiscount > 0 && (
              <div style={{ marginTop: '10px', color: '#00ff80', fontWeight: 'bold' }}>
                🌟 Early Bird Discount: {currentEvent.earlyBirdDiscount}% OFF!
              </div>
            )}

            {/* Map Widget embedded cleanly */}
            <MapWidget venue={currentEvent.venue || 'TBA'} />
          </div>

          {/* Right Column Ticket Prices */}
          <div className="prices-sidebar-column">
            <div className="ticket-prices-card">
              <h2 className="prices-card-title">Ticket <span className="light-sub">Prices</span></h2>
              <div className="tiers-table">
                {currentEvent.ticketTiers && currentEvent.ticketTiers.length > 0 ? currentEvent.ticketTiers.map((tier, idx) => (
                  <div key={idx} className="tier-item-row">
                    <span className="tier-name-label">{tier.name}</span>
                    <span className="tier-price-value">{tier.price} LKR</span>
                  </div>
                )) : (
                  <div className="tier-item-row">
                    <span className="tier-name-label">General Admission</span>
                    <span className="tier-price-value">Free / TBA</span>
                  </div>
                )}
              </div>
              <button className="buy-tickets-orange-btn" onClick={() => onOpenBooking(currentEvent)}>
                Buy Tickets &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EventDetails;
