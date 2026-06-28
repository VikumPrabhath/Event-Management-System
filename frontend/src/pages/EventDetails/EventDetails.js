import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MapWidget from '../../components/MapWidget/MapWidget';
import './EventDetails.css';

function EventDetails({ event, onBack, onOpenBooking, theme, toggleTheme, user, onOpenAuth }) {
  const defaultDetails = {
    title: 'ANAGATHAYE BY WAYOO',
    type: 'Indoor live in concert',
    artistLineup: 'Athma Liyanage | Amal Perera | Namal Udugama | BNS',
    musicBy: 'WAYO',
    date: '2026-07-17 19:00:00',
    venue: 'Musaeus College Auditorium',
    organizer: 'Asipiya Entertainment'
  };

  const currentEvent = event || defaultDetails;

  const [timeLeft, setTimeLeft] = useState({ days: 25, hours: 12, minutes: 54, seconds: 15 });

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
    { name: 'Balcony', price: '4000.00 LKR' },
    { name: 'Silver', price: '6000.00 LKR' },
    { name: 'Gold', price: '7500.00 LKR' },
    { name: 'Platinum', price: '10000.00 LKR' },
    { name: 'VIP', price: '15000.00 LKR' }
  ];

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
            <p className="event-subtitle">{currentEvent.type || defaultDetails.type}</p>

            <div className="lineup-box">
              <strong>Artist line up</strong>
              <p>{currentEvent.artistLineup || defaultDetails.artistLineup}</p>
              <p className="music-by">Music by {currentEvent.musicBy || defaultDetails.musicBy}</p>
            </div>

            <div className="event-meta-list">
              <div className="meta-row">
                <span className="meta-bullet">📅</span>
                <span>{currentEvent.date}</span>
              </div>
              <div className="meta-row">
                <span className="meta-bullet">📍</span>
                <span>{currentEvent.venue || defaultDetails.venue}</span>
              </div>
              <div className="meta-row">
                <span className="meta-bullet">Organized by</span>
                <span>{currentEvent.organizer || defaultDetails.organizer}</span>
              </div>
            </div>

            {/* Map Widget embedded cleanly */}
            <MapWidget venue={currentEvent.venue || defaultDetails.venue} />
          </div>

          {/* Right Column Ticket Prices */}
          <div className="prices-sidebar-column">
            <div className="ticket-prices-card">
              <h2 className="prices-card-title">Ticket <span className="light-sub">Prices</span></h2>
              <div className="tiers-table">
                {ticketTiers.map((tier, idx) => (
                  <div key={idx} className="tier-item-row">
                    <span className="tier-name-label">{tier.name}</span>
                    <span className="tier-price-value">{tier.price}</span>
                  </div>
                ))}
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
