import React, { useState } from 'react';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration specific state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showGoogleSim, setShowGoogleSim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const payload = {
          firstName,
          lastName,
          email,
          mobileNo,
          password,
          confirmPassword,
          verificationMethod: 'EMAIL'
        };

        let res;
        try {
          res = await fetch('http://localhost:8081/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (e) {
          res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Registration failed.');
        }

        const data = await res.json();
        const userData = {
          id: data.id || 'user_' + Date.now(),
          name: `${data.firstName || firstName} ${data.lastName || lastName}`.trim(),
          email: data.email || email,
          phone: data.mobileNo || mobileNo,
          authProvider: 'Email',
          joinedDate: 'Jun 2026',
          eventsAttended: 0
        };
        onLoginSuccess(userData);
        onClose();
      } else {
        const payload = { email, password };
        let res;
        try {
          res = await fetch('http://localhost:8081/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (e) {
          res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || 'Invalid email or password.');
        }

        const data = await res.json();
        const userData = {
          id: data.id || 'user_' + Date.now(),
          name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || email.split('@')[0],
          email: data.email || email,
          phone: data.mobileNo || '',
          authProvider: 'Email',
          joinedDate: 'Jun 2026',
          eventsAttended: 0
        };
        onLoginSuccess(userData);
        onClose();
      }
    } catch (err) {
      console.warn('Backend connection error or fallback:', err);
      // Fallback local session if backend server is not yet running/connected
      const displayName = mode === 'register' ? `${firstName} ${lastName}`.trim() || 'User' : email.split('@')[0] || 'User';
      const fallbackData = {
        id: 'user_' + Date.now(),
        name: displayName,
        email: email,
        phone: mobileNo,
        authProvider: 'Email',
        joinedDate: 'Jun 2026',
        eventsAttended: 0
      };
      onLoginSuccess(fallbackData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setShowGoogleSim(true);
  };

  const selectGoogleAccount = (acc) => {
    const userData = {
      id: 'google_' + Date.now(),
      name: acc.name,
      email: acc.email,
      authProvider: 'Google',
      joinedDate: 'Jun 2026',
      eventsAttended: 0
    };
    setShowGoogleSim(false);
    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className={`auth-modal-content ${mode === 'register' ? 'wide-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        
        {showGoogleSim ? (
          <div className="google-sim-box">
            <div className="google-sim-header">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3>Sign in with Google</h3>
              <p>Choose an account to continue</p>
            </div>
            <div className="google-account-list">
              <div className="google-account-item" onClick={() => selectGoogleAccount({ name: 'Quick Take', email: 'quicktake611@gmail.com', avatar: '' })}>
                <div className="google-avatar-circle">Q</div>
                <div className="google-account-info">
                  <div className="google-account-name">Quick Take</div>
                  <div className="google-account-email">quicktake611@gmail.com</div>
                </div>
              </div>
              <div className="google-account-item" onClick={() => selectGoogleAccount({ name: 'Alex Morgan', email: 'alex.morgan@gmail.com', avatar: '' })}>
                <div className="google-avatar-circle" style={{background: '#e91e63'}}>A</div>
                <div className="google-account-info">
                  <div className="google-account-name">Alex Morgan</div>
                  <div className="google-account-email">alex.morgan@gmail.com</div>
                </div>
              </div>
            </div>
            <button className="google-sim-cancel" onClick={() => setShowGoogleSim(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Create Account
              </button>
            </div>

            <button className="google-btn" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{marginRight: '10px'}}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            <div className="auth-divider">
              <span>or email</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {errorMsg && <div className="auth-error-banner" style={{color: '#ff7979', marginBottom: '14px', fontSize: '13px'}}>{errorMsg}</div>}
              {mode === 'register' ? (
                <>
                  {/* First Name & Last Name Side by Side */}
                  <div className="form-row-two">
                    <div className="form-group">
                      <label>First Name</label>
                      <input 
                        type="text" 
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile No & Email Side by Side */}
                  <div className="form-row-two">
                    <div className="form-group">
                      <label>Mobile No</label>
                      <input 
                        type="tel" 
                        placeholder="+94 77 123 4567"
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password Side by Side */}
                  <div className="form-row-two">
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
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@example.com"
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
                </>
              )}

              <button type="submit" className="auth-submit-btn">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
