import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import PromoBanners from '../../components/PromoBanners/PromoBanners';
import EventSection from '../../components/EventSection/EventSection';
import TypeBannersSection from '../../components/TypeBannersSection/TypeBannersSection';
import Footer from '../../components/Footer/Footer';
import './LandingPage.css';

function LandingPage({ onSelectEvent, theme, toggleTheme, user, onOpenAuth, onOpenOrganizerAuth }) {
  const [events, setEvents] = useState(() => {
    const cached = sessionStorage.getItem('landing_events_cache');
    return cached ? JSON.parse(cached) : [];
  });
  const [isLoading, setIsLoading] = useState(events.length === 0);

  useEffect(() => {
    fetch('http://localhost:8081/api/events/summary')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const validEvents = data.filter(event => {
            if (!event.date) return true;
            const eventDate = new Date(event.date);
            return eventDate >= today;
          });
          
          setEvents(validEvents);
          sessionStorage.setItem('landing_events_cache', JSON.stringify(validEvents));
        }
      })
      .catch(err => console.error('Error loading events:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={`landing-page ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onOpenAuth={onOpenAuth} />
      {isLoading ? (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? '#0d0e15' : '#f4f6f8' }}>
          <div className="spinner" style={{ borderColor: 'rgba(255, 106, 19, 0.3)', borderTopColor: '#ff6a13', animation: 'spin 1s linear infinite' }}></div>
          <h2 style={{ color: theme === 'dark' ? '#fff' : '#1a1b4b', marginTop: '20px' }}>Loading Experiences...</h2>
        </div>
      ) : (
        <main className="main-content">
          <Hero events={events} onSelectEvent={onSelectEvent} onOpenAuth={onOpenAuth} onOpenOrganizerAuth={onOpenOrganizerAuth} />
          <TypeBannersSection onSelectEvent={onSelectEvent} />
          <PromoBanners events={events} onSelectEvent={onSelectEvent} />
          <EventSection events={events} onSelectEvent={onSelectEvent} />
        </main>
      )}
      <Footer />
    </div>
  );
}

export default LandingPage;
