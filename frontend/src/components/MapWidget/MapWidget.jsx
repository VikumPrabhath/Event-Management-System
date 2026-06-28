import React from 'react';
import './MapWidget.css';

function MapWidget({ venue, locationName }) {
  const venueTitle = venue || locationName || 'Viharamahadevi Outdoor Stage, Colombo';
  const encodedVenue = encodeURIComponent(venueTitle);

  return (
    <div className="map-widget-card">
      <div className="map-header">
        <h4>Event Location & Map</h4>
      </div>
      <div className="map-frame-wrapper">
        <iframe
          title="Event Location Map"
          width="100%"
          height="240"
          style={{ border: 0, borderRadius: '12px' }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${encodedVenue}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
        ></iframe>
      </div>
      <div className="map-footer">
        <span className="venue-text">{venueTitle}</span>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodedVenue}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="directions-btn"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}

export default MapWidget;
