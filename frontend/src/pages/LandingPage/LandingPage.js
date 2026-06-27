import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import EventSection from '../../components/EventSection/EventSection';
import Footer from '../../components/Footer/Footer';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main className="main-content">
        <Hero />
        <EventSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
