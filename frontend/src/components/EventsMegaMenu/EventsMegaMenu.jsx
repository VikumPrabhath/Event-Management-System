import React, { useState } from 'react';
import './EventsMegaMenu.css';

function EventsMegaMenu({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('Outdoor Musical Concert');

  if (!isOpen) return null;

  const categories = [
    'Top events',
    'Today',
    'This Weekend',
    'This Month',
    'Indoor Musical Concert',
    'EDM',
    'Outdoor Musical Concert',
    'Running Event',
    'Theatre',
    'Dinner Dance',
    'Workshop',
    'Comedy Show',
    'Boat Party',
    'All events'
  ];

  const categoryEvents = {
    'Outdoor Musical Concert': [
      { id: '1', title: 'SIHINA NAGARAYA', date: 'Fri 3 Jul', price: '2000 LKR', bg: 'linear-gradient(135deg, #0f2027, #2c5364)' },
      { id: '2', title: 'MARIANS LIVE AT THE...', date: 'Fri 17 Jul', price: '5000 LKR', bg: 'linear-gradient(135deg, #11998e, #38ef7d)' },
      { id: '3', title: 'PUB LONDON PRISION...', date: 'Fri 24 Jul', price: '2000 LKR', bg: 'linear-gradient(135deg, #ff9966, #ff5e62)' },
      { id: '4', title: 'DHARA 2026', date: 'Sat 4 Jul', price: '1000 LKR', bg: 'linear-gradient(135deg, #8E2DE2, #4A00E0)' },
      { id: '5', title: 'MIHIRAVIYE LANTERN...', date: 'Fri 10 Jul', price: '1500 LKR', bg: 'linear-gradient(135deg, #f80759, #bc4e9c)' },
      { id: '6', title: 'PUB LONDON PRISION...', date: 'Sat 25 Jul', price: '2000 LKR', bg: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
      { id: '7', title: 'YAATHRA', date: 'Fri 14 Aug', price: '5000 LKR', bg: 'linear-gradient(135deg, #f7971e, #ffd200)' }
    ],
    'Top events': [
      { id: '101', title: 'COLOMBO MUSIC FEST', date: 'Sat 15 Aug', price: '4500 LKR', bg: 'linear-gradient(135deg, #654ea3, #eaafc8)' },
      { id: '102', title: 'KANDY NIGHT LIVE', date: 'Fri 22 Aug', price: '3000 LKR', bg: 'linear-gradient(135deg, #2C3E50, #FD746C)' }
    ]
  };

  const currentEvents = categoryEvents[activeCategory] || categoryEvents['Outdoor Musical Concert'];

  return (
    <div className="mega-menu-overlay" onClick={onClose}>
      <div className="mega-menu-container" onClick={(e) => e.stopPropagation()}>
        <div className="mega-menu-sidebar">
          {categories.map((cat) => (
            <div 
              key={cat}
              className={`sidebar-item ${activeCategory === cat ? 'active' : ''}`}
              onMouseEnter={() => setActiveCategory(cat)}
              onClick={() => setActiveCategory(cat)}
            >
              <span>{cat}</span>
              {cat === 'Top events' && <span className="arrow">&rsaquo;</span>}
            </div>
          ))}
        </div>

        <div className="mega-menu-content">
          <h2 className="mega-content-title">{activeCategory} Events</h2>
          <div className="events-mini-grid">
            {currentEvents.map((ev) => (
              <div key={ev.id} className="mini-event-card">
                <div className="mini-thumb" style={{ background: ev.bg }}></div>
                <div className="mini-details">
                  <h4 className="mini-title">{ev.title}</h4>
                  <p className="mini-meta">{ev.date} - {ev.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsMegaMenu;
