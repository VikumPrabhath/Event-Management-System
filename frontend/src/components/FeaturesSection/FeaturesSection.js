import React from 'react';
import './FeaturesSection.css';

function FeaturesSection() {
  const features = [
    {
      icon: '🎫',
      title: 'Instant e-Tickets',
      description: 'Get your QR code tickets instantly on your phone. No printing required, just scan and go!'
    },
    {
      icon: '🛡️',
      title: '100% Secure & Verified',
      description: 'All tickets are verified and transactions are secured with industry-leading encryption.'
    },
    {
      icon: '🔥',
      title: 'Exclusive Access',
      description: 'Get early access and VIP packages to the most anticipated events in the country.'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>Why Choose <span className="highlight-text">Sellout</span>?</h2>
          <p>We redefine how you experience live events with a seamless, secure, and premium platform.</p>
        </div>
        <div className="features-grid">
          {features.map((feat, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
        
        {/* Newsletter Subscription */}
        <div className="newsletter-box">
          <div className="newsletter-content">
            <h3>Never Miss an Event!</h3>
            <p>Subscribe to our newsletter to get early access to tickets and exclusive discounts.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
