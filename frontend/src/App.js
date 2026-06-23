import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('⏳ Waiting for backend...');

  useEffect(() => {
    fetch('/api/users')
      .then(response => {
        if (response.ok) {
          setMessage('✅ Backend is connected successfully! (No users found yet, but connection works!)');
        } else {
          setMessage('⚠️ Backend responded, but with an error.');
        }
      })
      .catch(error => {
        setMessage('❌ Cannot reach backend. Make sure Spring Boot is running on port 8080!');
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>🎉 Event Management System</h1>
      <h2 style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</h2>
      <p>Frontend is running on Port 3000</p>
      <p>Backend should be running on Port 8080</p>
    </div>
  );
}

export default App;