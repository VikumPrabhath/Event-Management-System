import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-logo">
          <span className="logo-sell" style={{ color: '#ff6a13', fontWeight: 900, fontSize: '32px' }}>sell</span>
          <span className="logo-out" style={{ color: '#1a1b4b', fontWeight: 900, fontSize: '32px' }}>out</span>
          <span className="logo-admin" style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>Admin Portal</span>
        </div>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter admin username"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              required 
            />
          </div>
          
          {error && <div className="login-error">{error}</div>}
          
          <button type="submit" className="login-btn">Secure Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
