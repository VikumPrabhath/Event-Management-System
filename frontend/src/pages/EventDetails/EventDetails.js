import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Ticket, AlertTriangle, Zap } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MapWidget from '../../components/MapWidget/MapWidget';
import './EventDetails.css';

function EventDetails({ onBack, onOpenBooking, theme, toggleTheme, user, onOpenAuth, refreshTrigger }) {
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
  }, [id, refreshTrigger]);

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
    return <div className={`event-details-loader ${theme}-mode`}>
      <div className="spinner"></div>
      <h2>Loading Experience...</h2>
    </div>;
  }

  if (!currentEvent) {
    return <div className={`event-details-loader ${theme}-mode`}><h2>Experience Not Found</h2></div>;
  }

  const isCancelled = currentEvent.status === 'CANCELLED';
  const defaultImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2070";
  const bgImage = currentEvent.imageUrl || defaultImage;

  return (
    <div className={`event-details-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onOpenAuth={onOpenAuth} />

      <main className="event-details-main">
        {/* Immersive Hero Section */}
        <section className="event-hero" style={{ backgroundImage: `url(${bgImage})` }}>
          <div className="hero-gradient-overlay"></div>
          
          <div className="hero-content">
            <div className="event-badges">
              <span className="badge category-badge">{currentEvent.type || currentEvent.category || 'General'}</span>
              {currentEvent.earlyBirdDiscount > 0 && (
                <span className="badge discount-badge" style={{display: 'flex', alignItems: 'center'}}><Zap size={14} style={{marginRight: '4px'}} /> {currentEvent.earlyBirdDiscount}% OFF</span>
              )}
            </div>
            <h1 className="hero-title">{currentEvent.title}</h1>
            <p className="hero-subtitle">
              By {organizer ? (organizer.companyName || organizer.name) : (currentEvent.organizerId || 'Premium Organizer')}
            </p>
            
            <div className="hero-countdown-glass">
              <h3 className="glass-title">Starts In</h3>
              <div className="countdown-grid">
                <div className="time-unit"><span className="val">{timeLeft.days}</span><span className="lbl">DAYS</span></div>
                <div className="time-unit"><span className="val">{timeLeft.hours}</span><span className="lbl">HOURS</span></div>
                <div className="time-unit"><span className="val">{timeLeft.minutes}</span><span className="lbl">MINS</span></div>
                <div className="time-unit"><span className="val">{timeLeft.seconds}</span><span className="lbl">SECS</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="details-content-grid">
          <div className="details-left">
            <div className="glass-panel about-panel">
              <h2>About The Experience</h2>
              <p className="description-text">{currentEvent.description || 'Join us for an unforgettable, mesmerizing experience filled with life, energy, and memories.'}</p>
            </div>

            <div className="glass-panel info-panel">
              <h2>Event Information</h2>
              <div className="info-list">
                <div className="info-item">
                  <div className="icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Calendar size={20} color="#ff6a13" /></div>
                  <div className="info-text">
                    <strong>Date & Time</strong>
                    <span>{currentEvent.date} at {currentEvent.timeFrom}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><MapPin size={20} color="#ff6a13" /></div>
                  <div className="info-text">
                    <strong>Venue</strong>
                    <span>{currentEvent.venue || 'TBA'}</span>
                  </div>
                </div>
                {remainingTickets !== null && (
                  <div className="info-item ticket-status-item">
                    <div className="icon" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ticket size={20} color="#ff6a13" /></div>
                    <div className="info-text">
                      <strong>Availability</strong>
                      <span className={remainingTickets === 0 ? 'sold-out-text' : 'available-text'}>
                        {remainingTickets === 0 ? 'SOLD OUT' : `${remainingTickets} Tickets Remaining`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel map-panel">
              <h2>Location</h2>
              <div className="map-wrapper">
                <MapWidget venue={currentEvent.venue || 'TBA'} />
              </div>
            </div>
          </div>

          <div className="details-right">
            <div className="glass-panel ticket-panel">
              <div className="ticket-header-art"></div>
              <h2>Select Your Tier</h2>
              <div className="tiers-list">
                {currentEvent.ticketTiers && currentEvent.ticketTiers.length > 0 ? (
                  currentEvent.ticketTiers.map((tier, idx) => (
                    <div key={idx} className="tier-card">
                      <div className="tier-info">
                        <span className="tier-name">{tier.name}</span>
                        <span className="tier-cap">Capacity: {tier.capacity}</span>
                      </div>
                      <div className="tier-price">{tier.price.toLocaleString()} LKR</div>
                    </div>
                  ))
                ) : (
                  <div className="tier-card">
                    <div className="tier-info"><span className="tier-name">General Admission</span></div>
                    <div className="tier-price">Free / TBA</div>
                  </div>
                )}
              </div>

              {isCancelled ? (
                <div className="cancelled-alert" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><AlertTriangle size={18} style={{marginRight: '6px'}} /> This event has been cancelled.</div>
              ) : remainingTickets === 0 ? (
                <button className="sold-out-btn" disabled>SOLD OUT</button>
              ) : (
                <button className="action-btn premium-buy-btn" onClick={() => onOpenBooking(currentEvent)}>
                  Reserve Tickets Now
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EventDetails;
