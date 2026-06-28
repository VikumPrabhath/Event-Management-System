import React from 'react';
import './SportsCard.css';

function SportsCard({ event, onSelectEvent }) {
  const defaultSports = {
    id: 't20-clash',
    title: 'Sri Lanka vs Australia T20 International',
    teamA: '🇱🇰 Sri Lanka',
    teamB: '🇦🇺 Australia',
    sportType: 'CRICKET T20',
    date: '14 AUGUST 2026',
    time: '7:00 PM Match Start',
    venue: 'R. Premadasa Stadium Colombo',
    price: 'LKR 1,500 Upwards',
    status: '🎟️ TICKETS OPEN'
  };

  const data = event || defaultSports;

  const handleClick = () => {
    if (onSelectEvent) onSelectEvent(data);
  };

  return (
    <div className="sports-card" onClick={handleClick}>
      <div className="sports-card-header">
        <span className="sport-type-badge">{data.sportType || 'SPORTS'}</span>
        <span className="sports-status">{data.status}</span>
      </div>

      {/* Versus Matchup Display */}
      <div className="matchup-box">
        <div className="team-badge">{data.teamA || 'Team A'}</div>
        <div className="vs-circle">VS</div>
        <div className="team-badge">{data.teamB || 'Team B'}</div>
      </div>

      <div className="sports-card-body">
        <h4 className="sports-event-title">{data.title}</h4>
        <p className="sports-venue">📍 {data.venue}</p>

        <div className="sports-footer">
          <div className="sports-time-info">
            <span className="s-date">📅 {data.date}</span>
            <span className="s-time">{data.time}</span>
          </div>
          <div className="sports-price-box">
            <label>FROM</label>
            <strong>{data.price}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SportsCard;
