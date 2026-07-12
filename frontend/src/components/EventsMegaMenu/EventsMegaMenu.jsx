import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EventsMegaMenu.css';

function EventsMegaMenu({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryEvents, setCategoryEvents] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:8081/api/events/summary')
        .then(res => res.json())
        .then(data => {
          if (!Array.isArray(data)) return;
          
          const grouped = {};
          data.forEach(ev => {
            const cat = ev.category || 'Other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              id: ev.id,
              title: ev.title,
              date: ev.date || 'TBA',
              price: ev.minPrice ? `${ev.minPrice} LKR` : 'Free',
              bg: ev.imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${ev.imageUrl})` : 'linear-gradient(135deg, #0f2027, #2c5364)'
            });
          });

          // Add a "Top events" category
          grouped['Top events'] = data.filter(ev => ev.trendingTag).map(ev => ({
             id: ev.id,
             title: ev.title,
             date: ev.date || 'TBA',
             price: ev.minPrice ? `${ev.minPrice} LKR` : 'Free',
             bg: ev.imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${ev.imageUrl})` : 'linear-gradient(135deg, #0f2027, #2c5364)'
          }));
          
          if (grouped['Top events'].length === 0 && data.length > 0) {
              grouped['Top events'] = grouped[Object.keys(grouped)[0]] || [];
          }

          const cats = ['Top events', ...Object.keys(grouped).filter(c => c !== 'Top events')];
          setCategoryEvents(grouped);
          setCategories(cats);
          setActiveCategory('Top events');
        })
        .catch(err => console.error("Failed to load mega menu events"));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEvents = categoryEvents[activeCategory] || [];

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
              <Link to={`/event/${ev.id}`} key={ev.id} style={{ textDecoration: 'none' }}>
                <div className="mini-event-card" onClick={onClose}>
                  <div className="mini-thumb" style={{ background: ev.bg }}></div>
                  <div className="mini-details">
                    <h4 className="mini-title">{ev.title}</h4>
                    <p className="mini-meta">{ev.date} - {ev.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsMegaMenu;
