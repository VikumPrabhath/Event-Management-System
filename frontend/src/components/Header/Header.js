import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [imgError, setImgError] = useState(false);

  // Logo fallback handler in case sellout.png isn't added yet
  const handleLogoError = () => {
    setImgError(true);
  };

  return (
    <header className="header">
      <div className="logo-container">
        {imgError ? (
          <div className="logo-fallback">
            <span className="logo-sell">sell</span>
            <span className="logo-out">out</span>
          </div>
        ) : (
          <img 
            src="/assets/sellout.png" 
            alt="sellout logo" 
            className="logo-img" 
            onError={handleLogoError}
          />
        )}
      </div>
      
      <nav className="nav-menu">
        <a href="#concerts" className="nav-link">Concerts</a>
        <a href="#theater" className="nav-link">Theater</a>
        <a href="#login" className="nav-link">Login</a>
      </nav>

      <div className="cta-container">
        <button className="book-ticket-btn">Book Ticket</button>
      </div>
    </header>
  );
}

export default Header;
