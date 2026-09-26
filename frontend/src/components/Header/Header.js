import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, ChevronDown, ChevronUp, User, Sun, Moon } from 'lucide-react';
import EventsMegaMenu from '../EventsMegaMenu/EventsMegaMenu';
import './Header.css';

function Header({ events: propEvents = [], onSelectEvent, theme, toggleTheme, isAdminView, user, onOpenAuth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [imgError, setImgError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const searchContainerRef = useRef(null);

  // Self-sufficient event storage for global search
  const [internalEvents, setInternalEvents] = useState(() => {
    if (propEvents && propEvents.length > 0) return propEvents;
    try {
      const cached = sessionStorage.getItem('landing_events_cache');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync or fetch events if not provided via props and not in cache
  useEffect(() => {
    // If parent supplied events (e.g. LandingPage), use them directly
    if (propEvents && propEvents.length > 0) {
      setInternalEvents(propEvents);
      return;
    }

    // Do not fetch on admin views where search is hidden
    if (isAdminView) return;

    // Check sessionStorage cache first
    try {
      const cached = sessionStorage.getItem('landing_events_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setInternalEvents(parsed);
          return;
        }
      }
    } catch (e) {
      // ignore parse errors and proceed to fetch
    }

    // Fallback: fetch once if cache is empty (e.g. direct visit to /event/:id)
    fetch('http://localhost:8081/api/events/summary')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const valid = data.filter(e => {
            if (!e.date) return true;
            return new Date(e.date) >= today;
          });
          setInternalEvents(valid);
          sessionStorage.setItem('landing_events_cache', JSON.stringify(valid));
        }
      })
      .catch(err => console.error('Failed to load global search events:', err));
  }, [propEvents, isAdminView]);

  // Close dropdown on click outside or on Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const handleLogoError = () => {
    setImgError(true);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      setIsOpen(true);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleCategoryNav = (hash, tab) => (e) => {
    e.preventDefault();

    if (location.pathname !== '/') {
      navigate(`/${hash}`);
      return;
    }

    window.location.hash = hash;
    const element = document.getElementById(hash.substring(1)) || document.getElementById('events-grid-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('select-event-tab', { detail: tab }));
  };

  const handleSelectEvent = (eventItem) => {
    setIsOpen(false);
    setSearchTerm('');
    if (onSelectEvent) {
      onSelectEvent(eventItem);
    } else {
      navigate(`/event/${eventItem.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (matchingEvents.length > 0) {
      handleSelectEvent(matchingEvents[0]);
    }
  };

  // Dynamic partial-matching across title, venue, and category
  const searchableEvents = (propEvents && propEvents.length > 0) ? propEvents : internalEvents;
  const trimmed = searchTerm.trim().toLowerCase();
  const matchingEvents = trimmed && searchableEvents.length > 0
    ? searchableEvents.filter(e => {
        const titleMatch = (e.title || '').toLowerCase().includes(trimmed);
        const venueMatch = (e.venue || '').toLowerCase().includes(trimmed);
        const categoryMatch = (e.category || '').toLowerCase().includes(trimmed);
        const isMusic = e.category === 'music' && (trimmed.includes('concert') || 'concert'.includes(trimmed) || trimmed.includes('music'));
        const isDrama = e.category === 'drama' && (trimmed.includes('theater') || trimmed.includes('theatre') || trimmed.includes('drama') || trimmed.includes('art'));
        return titleMatch || venueMatch || categoryMatch || isMusic || isDrama;
      })
    : [];

  return (
    <header className={`header ${theme === 'dark' ? 'dark-header' : ''}`} style={{position: 'relative', zIndex: 1000}}>
      <div className="logo-container">
        <Link to="/" style={{ textDecoration: 'none' }}>
          {imgError ? (
            <div className="logo-fallback">
              <span className="logo-sell">sell</span>
              <span className="logo-out">out</span>
            </div>
          ) : (
            <div className="logo-wrapper">
              <img 
                src="/assets/sellout.png" 
                alt="sellout logo" 
                className="logo-img" 
                onError={handleLogoError}
              />
            </div>
          )}
        </Link>
      </div>

      {!isAdminView ? (
        <>
          {/* Integrated Search Bar with Floating Autocomplete Dropdown */}
          <div className="header-search-container" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="header-search-form">
              <span className="header-search-icon"><Search size={16} /></span>
              <input 
                type="text" 
                placeholder="Search concerts, theater..." 
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="header-search-input"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  className="header-search-clear" 
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Floating Dropdown Results Panel */}
            {isOpen && trimmed.length > 0 && (
              <div className="search-results-dropdown">
                {matchingEvents.length > 0 ? (
                  <div className="search-results-list">
                    {matchingEvents.map((item) => {
                      const formattedDate = item.date 
                        ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                        : '';
                      const metaInfo = [item.venue, formattedDate].filter(Boolean).join(' • ');
                      const priceText = item.minPrice && item.minPrice > 0 
                        ? `From LKR ${Number(item.minPrice).toLocaleString('en-US')}` 
                        : 'Free';

                      return (
                        <div 
                          key={item.id} 
                          className="search-result-item"
                          onClick={() => handleSelectEvent(item)}
                        >
                          <div className="search-result-thumb-wrapper">
                            <img 
                              src={item.imageUrl || '/assets/default-event.jpg'} 
                              alt={item.title} 
                              className="search-result-thumb"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/default-event.jpg';
                              }}
                            />
                          </div>
                          <div className="search-result-info">
                            <h4 className="search-result-title">{item.title}</h4>
                            <span className="search-result-meta">{metaInfo}</span>
                          </div>
                          <div className="search-result-price">
                            {priceText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="search-no-results">
                    <span className="no-results-icon">🔍</span>
                    <p className="no-results-title">No events found</p>
                    <p className="no-results-desc">No events match "{searchTerm}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <nav className="nav-menu">
            <button 
              className="nav-link nav-dropdown-trigger" 
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              style={{background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center'}}
            >
              Events {showMegaMenu ? <ChevronUp size={14} style={{marginLeft: '4px'}} /> : <ChevronDown size={14} style={{marginLeft: '4px'}} />}
            </button>
            <a href="#concerts" onClick={handleCategoryNav('#concerts', 'Concerts')} className="nav-link">Concerts</a>
            <a href="#theater" onClick={handleCategoryNav('#theater', 'Art & Drama')} className="nav-link">Theater</a>
            {user ? (
              <Link to={user.role === 'Organizer' ? "/organizer/dashboard" : "/dashboard"} className="nav-link user-dash-link">
                My Dashboard
              </Link>
            ) : (
              <button onClick={onOpenAuth} className="nav-link nav-auth-btn">
                Sign In / Register
              </button>
            )}
          </nav>

          <div className="cta-container">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            {user ? (
              <Link to="/dashboard" className="book-ticket-btn" style={{textDecoration: 'none'}}>
                My Tickets
              </Link>
            ) : (
              <button className="book-ticket-btn" onClick={onOpenAuth}>
                Book Ticket
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="admin-header-title">
            {user?.role === 'Organizer' ? `${user.name || 'Organizer'} Dashboard` : 'Admin Dashboard'}
          </div>
          <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="admin-avatar" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}><User size={20} color="#8b90a0" /></div>
            <span className="admin-welcome">
              {user?.role === 'Organizer' ? `Welcome ${user.name || 'Organizer'}` : 'Welcome Admin'}
            </span>
            <button className="theme-toggle-btn admin-theme-btn" onClick={toggleTheme} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('admin_authenticated', 'false');
                window.location.href = '/admin';
              }}
              style={{ background: 'transparent', border: '1px solid #2a2d3d', color: '#8b90a0', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
            >
              Logout
            </button>
          </div>
        </>
      )}
      <EventsMegaMenu isOpen={showMegaMenu} onClose={() => setShowMegaMenu(false)} />
    </header>
  );
}

export default Header;