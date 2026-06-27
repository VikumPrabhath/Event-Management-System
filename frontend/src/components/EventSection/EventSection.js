import React, { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import './EventSection.css';

function EventSection() {
  const [activeTab, setActiveTab] = useState('Concerts');

  const tabs = ['Concerts', 'Theater', 'Family'];

  // Mock events data matching the mockup
  const mockEvents = {
    Concerts: [
      {
        date: '3, July 2026',
        time: '7:00 PM',
        title: 'Shina Nayagara Lotus Tower Colombo',
        category: 'Out Door Musical Event',
        price: 'LKR 8,990 Upwards'
      }
    ],
    Theater: [
      {
        date: '10, August 2026',
        time: '6:30 PM',
        title: 'Classical Theater Drama - Nelum Pokuna',
        category: 'Indoor Drama Event',
        price: 'LKR 4,500 Upwards'
      }
    ],
    Family: [
      {
        date: '15, December 2026',
        time: '4:00 PM',
        title: 'Family Winter Carnival - Viharamahadevi Park',
        category: 'Outdoor Family Festival',
        price: 'LKR 2,000 Upwards'
      }
    ]
  };

  return (
    <section className="event-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-highlight">Latest</span> Events
        </h2>
        
        <div className="tab-navigation">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="events-grid">
          {mockEvents[activeTab].map((event, index) => (
            <EventCard key={index} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventSection;
