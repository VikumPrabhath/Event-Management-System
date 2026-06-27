import React, { useState } from 'react';
import './Footer.css';

function Footer() {
  const [imgError, setImgError] = useState(false);

  const handleLogoError = () => {
    setImgError(true);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Column 1: Logo, Description, and Socials */}
        <div className="footer-col about-col">
          <div className="footer-logo">
            {imgError ? (
              <div className="logo-fallback-footer">
                <span className="logo-sell">sell</span>
                <span className="logo-out">out</span>
              </div>
            ) : (
              <img 
                src="/assets/sellout.png" 
                alt="sellout logo" 
                className="footer-logo-img" 
                onError={handleLogoError}
              />
            )}
          </div>
          <p className="footer-desc">
            Sellout is one of the fast-growing ticket marketplaces that includes events of music, sport, art, theatre, and more.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" className="social-icon fb" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.889v1.111h3l-.238 3h-2.762v8h-3v-8h-2v-3h2v-1.923c0-2.022 1.064-3.077 3.461-3.077h2.539v3z"/></svg>
            </a>
            <a href="https://instagram.com" className="social-icon ig" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://whatsapp.com" className="social-icon wa" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.48 4.793 1.482 5.385 0 9.769-4.321 9.772-9.63 0-2.573-1.002-4.991-2.823-6.814-1.82-1.822-4.237-2.825-6.814-2.826-5.39 0-9.778 4.322-9.78 9.632-.001 1.686.447 3.334 1.3 4.794l-1.03 3.766 3.882-1.008zm11.233-6.49c-.27-.135-1.597-.788-1.845-.878-.248-.09-.428-.135-.609.135-.18.27-.698.878-.856 1.058-.158.18-.315.202-.585.067-.27-.135-1.139-.42-2.17-1.34-1.01-.902-1.688-2.016-1.887-2.353-.198-.337-.021-.519.146-.685.15-.15.315-.36.473-.54.157-.18.21-.315.315-.525.105-.21.052-.394-.023-.529-.075-.135-.609-1.466-.834-2.006-.219-.526-.44-.454-.609-.462-.158-.007-.338-.008-.518-.008-.18 0-.473.067-.72.337-.248.27-.946.923-.946 2.25s.968 2.61 1.103 2.79c.135.18 1.905 2.909 4.616 4.08.645.278 1.148.445 1.541.57.65.207 1.242.177 1.708.108.52-.078 1.597-.653 1.822-1.283.226-.63.226-1.17.158-1.283-.068-.112-.248-.18-.518-.315z"/></svg>
            </a>
            <a href="https://linkedin.com" className="social-icon li" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="mailto:helo@sellout.com" className="social-icon mail" aria-label="Email">
              <svg viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 4.712v-9.458l4.623 4.746zm1.09 1.117l4.287 4.401 4.287-4.401 5.348 5.454h-19.271l5.349-5.454zm1.09-1.117l4.622-4.746 4.622 4.746-4.622 4.746-4.622-4.746zm10.748 3.595l4.623-4.712v9.458l-4.623-4.746z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Site map */}
        <div className="footer-col sitemap-col">
          <h3 className="footer-title">Site map</h3>
          <ul className="footer-links">
            <li><a href="#concerts">Concerts</a></li>
            <li><a href="#tickets">Tickets</a></li>
            <li><a href="#login">Login</a></li>
            <li><a href="#booking">Booking</a></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-col contact-col">
          <h3 className="footer-title"><span className="title-dot">...</span> Contact</h3>
          <ul className="contact-details-list">
            <li>
              <span className="contact-icon">📞</span>
              <span className="contact-text">+94777389172 &nbsp;|&nbsp; +94777371672 &nbsp;|&nbsp; +94777074872</span>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span className="contact-text">120/5 Vidya Mawatha, Colombo 00700</span>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <span className="contact-text">helo@sellout.com</span>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
