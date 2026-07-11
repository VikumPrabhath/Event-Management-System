import React, { useState } from 'react';
import './OrganizerAuthModal.css';

function OrganizerAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const payload = { orgName, phone, email, password };
        const res = await fetch('http://localhost:8081/api/organizers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Registration failed.');
        }

        alert('Registration successful! Please wait for Admin approval before logging in.');
        setMode('login');
      } else {
        const payload = { email, password };
        const res = await fetch('http://localhost:8081/api/organizers/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Invalid credentials or pending approval.');
        }

        const data = await res.json();
        // Map backend properties to session properties
        const sessionData = {
          id: data.id,
          name: data.orgName,
          email: data.email,
          role: 'Organizer',
          joinedDate: 'Jun 2026'
        };
        onLoginSuccess(sessionData);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Connection failed.');
    } finally {
      setLoading(false);
    }
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
          {errorMsg && <div className="org-error-banner" style={{color: '#ff7979', marginBottom: '14px', fontSize: '13px'}}>{errorMsg}</div>}
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
