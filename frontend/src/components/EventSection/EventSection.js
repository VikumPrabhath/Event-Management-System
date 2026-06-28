import React, { useState } from 'react';
import EventCard from '../EventCard/EventCard';
import SportsCard from '../SportsCard/SportsCard';
import './EventSection.css';

function EventSection({ onSelectEvent }) {
  const [activeTab, setActiveTab] = useState('Concerts');

  const tabs = ['Concerts', 'Sports & Adventure', 'Art & Drama', 'Family'];

  // Mock events dataset matching TicketsMinistry feature depth
  const mockEvents = {
    'Concerts': [
      {
        id: 'shina-nayagara',
        date: 'FRI, JUL 24, 2026',
        time: '7:00 PM',
        title: 'Shina Nayagara Lotus Tower',
        category: 'Outdoor Musical Concert',
        price: 'LKR 8,990.00',
        countdown: '26d : 07h : 38m',
        trendingTag: '★ Now Trending 🔥'
      },
      {
        id: 'marians-edge',
        date: 'SAT, MAY 17, 2026',
        time: '7:30 PM',
        title: 'Marians Live at the Edge',
        category: 'Live Beach Concert',
        price: 'LKR 4,000.00',
        countdown: '14d : 10h : 20m',
        trendingTag: '⚡ Selling Fast'
      },
      {
        id: 'kasun-kalhara',
        date: 'WED, NOV 25, 2026',
        time: '6:30 PM',
        title: 'Love in Concert - Kasun Kalhara',
        category: 'Indoor Symphony',
        price: 'LKR 5,000.00',
        countdown: '42d : 15h : 10m',
        trendingTag: '🎟️ Instant Booking'
      }
    ],
    'Sports & Adventure': [
      {
        id: 't20-clash-premadasa',
        title: 'Sri Lanka vs Australia T20',
        teamA: '🇱🇰 Sri Lanka',
        teamB: '🇦🇺 Australia',
        sportType: 'CRICKET T20',
        date: '14 AUG 2026',
        time: '7:00 PM Night Match',
        venue: 'R. Premadasa Stadium Colombo',
        price: 'LKR 1,500.00',
        status: '🎟️ TICKETS OPEN'
      },
      {
        id: 'rugby-finals-crfc',
        title: 'Bradby Shield Rugby Tournament',
        teamA: '🎒 Royal College',
        teamB: '🛡️ Trinity College',
        sportType: 'RUGBY LEAGUE',
        date: '29 AUG 2026',
        time: '4:00 PM Kickoff',
        venue: 'Sugathadasa Stadium Colombo',
        price: 'LKR 2,000.00',
        status: '🔥 FEW SEATS LEFT'
      }
    ],
    'Art & Drama': [
      {
        id: 'theater-drama-nelum',
        date: 'MON, AUG 10, 2026',
        time: '6:30 PM',
        title: 'Classical Drama - Nelum Pokuna',
        category: 'Stage Drama & Play',
        price: 'LKR 4,500.00',
        countdown: '30d : 05h : 12m',
        trendingTag: '🎭 Popular Play'
      }
    ],
    'Family': [
      {
        id: 'winter-carnival-park',
        date: 'SUN, DEC 15, 2026',
        time: '4:00 PM',
        title: 'Family Winter Carnival Colombo',
        category: 'Outdoor Family Festival',
        price: 'LKR 2,000.00',
        countdown: '50d : 18h : 00m',
        trendingTag: '🎡 Kids Special'
      }
    ]
  };

  return (
    <section id="events-grid-section" className="event-section">
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
          {activeTab === 'Sports & Adventure' ? (
            mockEvents['Sports & Adventure'].map((event, index) => (
              <SportsCard key={index} event={event} onSelectEvent={onSelectEvent} />
            ))
          ) : (
            mockEvents[activeTab]?.map((event, index) => (
              <EventCard key={index} event={event} onSelectEvent={onSelectEvent} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default EventSection;
