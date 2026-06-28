import React, { useState } from 'react';
import './OrganizerAuthModal.css';

function OrganizerAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const organizerData = {
      id: 'org_' + Date.now(),
      name: mode === 'register' ? orgName : (email.split('@')[0] || 'Organizer'),
      email: email,
      role: 'Organizer',
      authProvider: 'Email',
      joinedDate: 'Jun 2026',
      eventsAttended: 0
    };
    onLoginSuccess(organizerData);
    onClose();
  };

  return (
    <div className="org-auth-overlay" onClick={onClose}>
      <div className="org-auth-content" onClick={(e) => e.stopPropagation()}>
        <button className="org-auth-close" onClick={onClose}>&times;</button>
        
        <div className="org-header">
          <h2>Event Organizer Portal</h2>
          <p>Publish and manage your events smoothly</p>
        </div>

        <div className="org-tabs">
          <button 
            className={`org-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Organizer Login
          </button>
          <button 
            className={`org-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register Organization
          </button>
        </div>

        <form onSubmit={handleSubmit} className="org-form">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Organization / Company Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. WAYO Productions"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Phone Number</label>
                <input 
                  type="text" 
                  placeholder="+94 77 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Business Email Address</label>
            <input 
              type="email" 
              placeholder="organizer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="org-submit-btn">
            {mode === 'login' ? 'Sign In as Organizer' : 'Create Organizer Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrganizerAuthModal;
