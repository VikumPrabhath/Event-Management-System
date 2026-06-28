import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import PromoBanners from '../../components/PromoBanners/PromoBanners';
import EventSection from '../../components/EventSection/EventSection';
import TypeBannersSection from '../../components/TypeBannersSection/TypeBannersSection';
import Footer from '../../components/Footer/Footer';
import './LandingPage.css';

function LandingPage({ onSelectEvent, theme, toggleTheme }) {
  return (
    <div className={`landing-page ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Hero onSelectEvent={onSelectEvent} />
        <TypeBannersSection onSelectEvent={onSelectEvent} />
        <PromoBanners onSelectEvent={onSelectEvent} />
        <EventSection onSelectEvent={onSelectEvent} />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
