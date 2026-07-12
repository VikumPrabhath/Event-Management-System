import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import PromoBanners from '../../components/PromoBanners/PromoBanners';
import EventSection from '../../components/EventSection/EventSection';
import TypeBannersSection from '../../components/TypeBannersSection/TypeBannersSection';
import Footer from '../../components/Footer/Footer';
import './LandingPage.css';

function LandingPage({ onSelectEvent, theme, toggleTheme, user, onOpenAuth, onOpenOrganizerAuth }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/events/summary')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data);
        }
      })
      .catch(err => console.error('Error loading events:', err));
  }, []);

  return (
    <div className={`landing-page ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onOpenAuth={onOpenAuth} />
      <main className="main-content">
        <Hero events={events} onSelectEvent={onSelectEvent} onOpenAuth={onOpenAuth} onOpenOrganizerAuth={onOpenOrganizerAuth} />
        <TypeBannersSection onSelectEvent={onSelectEvent} />
        <PromoBanners events={events} onSelectEvent={onSelectEvent} />
        <EventSection events={events} onSelectEvent={onSelectEvent} />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
