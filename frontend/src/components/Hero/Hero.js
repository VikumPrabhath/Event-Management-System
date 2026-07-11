import React, { useState, useEffect } from 'react';
import './Hero.css';

function Hero({ onSelectEvent, onOpenAuth, onOpenOrganizerAuth }) {
  const [dbEvents, setDbEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/events')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setDbEvents(data);
        }
      })
      .catch(err => {
        console.warn('Hero events load error');
      });
  }, []);

  const stackEvents = dbEvents.map(e => ({
    id: e.id,
    title: e.title,
    date: e.date ? new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'UPCOMING',
    doors: `Doors ${e.timeFrom || '7:00 PM'}`,
    price: e.ticketTiers && e.ticketTiers.length > 0 ? `LKR ${e.ticketTiers[0].price.toLocaleString()}` : 'Free',
    countdown: 'Upcoming',
    bgGradient: 'linear-gradient(135deg, #1f1c2c, #4a4c84)',
    icon: '🎤',
    ticketTiers: e.ticketTiers,
    earlyBirdDiscount: e.earlyBirdDiscount,
    earlyBirdLimit: e.earlyBirdLimit,
    ticketsSold: e.ticketsSold
  }));

  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-cycle animation timer (swapping cards every 3.5s)
  useEffect(() => {
    if (stackEvents.length === 0) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % stackEvents.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [stackEvents.length]);

  const hasEvents = stackEvents.length > 0;
  const activeCard = hasEvents ? stackEvents[activeIdx] : null;
  const nextCard = hasEvents ? stackEvents[(activeIdx + 1) % stackEvents.length] : null;

  return (
    <section className="hero-modern">
      <div className="hero-modern-container">
        
        {/* Left Column: Authentic Copy & CTAs */}
        <div className="hero-left">
          <div className="hero-tag-pill">
            <span className="live-dot"></span> SRI LANKA'S PREMIER TICKETING PLATFORM
          </div>

          <h1 className="hero-heading">
            Your Gateway to<br />
            <span className="heading-highlight">Unforgettable Live Moments.</span>
          </h1>

          <p className="hero-description">
            Experience world-class concerts, adrenaline-fueled sports tournaments, and riveting theatre productions. Book verified e-tickets with 100% instant confirmation.
          </p>

          <div className="hero-actions">
            <a href="#events-grid-section" className="cta-primary">
              Explore All Events
            </a>
            <button className="cta-secondary" onClick={() => onSelectEvent && onSelectEvent(activeCard)}>
              View Featured
            </button>
            <button className="cta-organizer" onClick={onOpenOrganizerAuth || onOpenAuth}>
              Publish or Organize Event
            </button>
          </div>

          <div className="trust-badges">
            <div className="badge-item">
              <span className="badge-icon">🛡️</span> 100% Verified Tickets
            </div>
            <div className="badge-item">
              <span className="badge-icon">⚡</span> Instant QR Delivery
            </div>
            <div className="badge-item">
              <span className="badge-icon">🎧</span> Dedicated Support
            </div>
          </div>
        </div>

        {/* Right Column: Animated 3D Card Stack Showcase (Matching exact image layout) */}
        <div className="hero-right">
          {hasEvents ? (
            <div className="exact-3d-stack-wrapper">
              {/* Realistic Explosive Sky Fireworks Background (Strictly UNDER the cards) */}
              <div className="fireworks-container">
                {[1, 2, 3].map((fw, fwIndex) => (
                  <div className={`realistic-firework fw-${fw}`} key={fwIndex}>
                    {[...Array(24)].map((_, i) => (
                      <div className="spark" key={i} style={{ transform: `rotate(${i * 15}deg)` }}></div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Dynamic Ambient Glowing Shape */}
              <div className="ambient-glow-shape"></div>

              {/* Background Card (Tilted behind) */}
              <div className="stack-3d-bg-card">
                <div className="bg-poster-area" style={{ background: nextCard.bgGradient }}>
                  <span className="bg-icon">{nextCard.icon}</span>
                </div>
              </div>

              {/* Foreground Main Animated Card */}
              <div 
                className="stack-3d-fg-card card-swap-anim"
                key={activeCard.id}
                onClick={() => onSelectEvent && onSelectEvent(activeCard)}
              >
                {/* Poster Image Area */}
                <div className="fg-poster-area" style={{ background: activeCard.bgGradient }}>
                  <span className="fg-icon">{activeCard.icon}</span>

                  {/* Pop-out Countdown Badge at bottom-left image border */}
                  <div className="exact-popout-countdown">
                    <div className="orange-clock-circle">⏰</div>
                    <div className="countdown-labels">
                      <label>STARTS IN</label>
                      <strong>{activeCard.countdown}</strong>
                    </div>
                  </div>
                </div>

                {/* Dashed Separator Line */}
                <div className="card-dashed-divider"></div>

                {/* Card Body */}
                <div className="fg-card-body">
                  <div className="body-left-info">
                    <span className="fg-date">{activeCard.date}</span>
                    <h4 className="fg-title">{activeCard.title}</h4>
                    <span className="fg-doors">{activeCard.doors}</span>
                  </div>
                  <div className="body-right-price">
                    <label>FROM</label>
                    <strong className="fg-price-val">{activeCard.price}</strong>
                  </div>
                </div>

                {/* Pop-out Corner Badge at bottom-right corner */}
                <div className="exact-popout-trending-badge">
                  ★ Now Trending 🔥
                </div>
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8b90a0' }}>
              <p>No featured events scheduled yet.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Hero;
