import React from 'react';
import './TypeBannersSection.css';

function TypeBannersSection({ onSelectEvent }) {
  const bannerTypes = [
    {
      id: 'theaters',
      type: 'Theaters & Plays',
      title: 'Drama & Live Theatre',
      desc: 'Experience the magic of live performances and storytelling.',
      bgClass: 'bg-theater',
      icon: '🎭'
    },
    {
      id: 'meetups',
      type: 'Meetups & Tech',
      title: 'Developer Meetups',
      desc: 'Connect with tech enthusiasts and join exclusive workshops.',
      bgClass: 'bg-meetups',
      icon: '💻'
    },
    {
      id: 'festivals',
      type: 'Festivals',
      title: 'Mega Music Festivals',
      desc: 'Dance the night away with top global artists.',
      bgClass: 'bg-festivals',
      icon: '🎪'
    }
  ];

  return (
    <section className="type-banners-section">
      <div className="type-banners-container">
        {bannerTypes.map((banner) => (
          <div key={banner.id} className={`type-banner-card ${banner.bgClass}`}>
            <div className="type-banner-content">
              <span className="type-badge">{banner.type}</span>
              <h3>{banner.title}</h3>
              <p>{banner.desc}</p>
              <button className="type-btn">Explore {banner.icon}</button>
            </div>
            <div className="type-icon-bg">{banner.icon}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TypeBannersSection;
