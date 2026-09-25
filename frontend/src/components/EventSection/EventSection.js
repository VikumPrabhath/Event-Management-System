import React, { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import SportsCard from '../SportsCard/SportsCard';
import MeetupCard from '../MeetupCard/MeetupCard';
import './EventSection.css';

const CATEGORY_TAB_MAPPING = {
  '#concerts': 'Concerts',
  '#theater': 'Art & Drama',
  '#drama': 'Art & Drama',
  '#sports': 'Sports & Adventure',
  '#family': 'Family',
  '#tech': 'Tech & Dev'
};

function EventSection({ events = [], onSelectEvent }) {
  const [activeTab, setActiveTab] = useState('Concerts');

  const tabs = ['Concerts', 'Sports & Adventure', 'Art & Drama', 'Family', 'Tech & Dev'];

  const mapping = {
    'Concerts': ['music'],
    'Sports & Adventure': ['sports'],
    'Art & Drama': ['drama'],
    'Family': ['family'],
    'Tech & Dev': ['tech-meetup', 'dev-meetup']
  };

  const getCategorizedEvents = (cat) => {
    const dbCats = mapping[cat] || [];
    const dbEvents = events.filter(e => dbCats.includes(e.category)).map(e => ({
      ...e,
      id: e.id,
      date: e.date ? new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : '',
      time: e.timeFrom || '',
      title: e.title,
      category: e.category === 'music' ? 'Concert & Music' : e.category === 'sports' ? 'Sport & Adventure' : e.category === 'drama' ? 'Art & Drama' : e.category === 'tech-meetup' ? 'Tech Meetup' : e.category === 'dev-meetup' ? 'Developer Meetup' : 'Family & Others',
      price: e.minPrice && e.minPrice > 0 ? `LKR ${Number(e.minPrice).toLocaleString('en-US')}` : 'Free',
      countdown: 'Upcoming',
      trendingTag: e.trendingTag || '',
      image: e.imageUrl
    }));

    return dbEvents;
  };

  const currentTabEvents = getCategorizedEvents(activeTab);

  return (
    <section id="concerts" className="event-section">
      <div id="events-grid-section"></div>
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-highlight">Explore</span> Upcoming Events
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
          {currentTabEvents.map((event, index) => {
            if (activeTab === 'Sports & Adventure' && event.teamA && event.teamB) {
              return <SportsCard key={index} event={event} onSelectEvent={onSelectEvent} />;
            }
            if (activeTab === 'Tech & Dev') {
              return <MeetupCard key={index} event={event} onSelectEvent={onSelectEvent} />;
            }
            return <EventCard key={index} event={event} onSelectEvent={onSelectEvent} />;
          })}
        </div>
      </div>
    </section>
  );
}

export default EventSection;
