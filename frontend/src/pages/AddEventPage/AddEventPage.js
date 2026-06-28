import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AddEventPage.css';

function AddEventPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [eventDate, setEventDate] = useState('');

  // Extract date from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get('date');
    if (dateParam) {
      setEventDate(dateParam);
    }
  }, [location]);

  return (
    <div className={`admin-portal-wrapper ${theme}-mode`}>
      <Header theme={theme} toggleTheme={toggleTheme} isAdminView={true} />
      
      <main className="add-event-page-container">
        <div className="add-event-header">
          <button className="back-btn" onClick={() => navigate('/admin')}>← Back to Dashboard</button>
          <h2 className="page-title">Add New Event</h2>
        </div>
        
        <form className="add-event-form" onSubmit={(e) => e.preventDefault()}>
          
          <div className="form-grid">
            {/* Left Column */}
            <div className="form-column">
              {/* Section: Event Details */}
              <div className="form-section">
                <h3 className="section-title">Event Details</h3>
                <div className="form-row">
                  <label>Event Name</label>
                  <input type="text" placeholder="Event Name" required />
                </div>
                <div className="form-row">
                  <label>Category</label>
                  <select required>
                    <option value="">Category</option>
                    <option value="music">Music</option>
                    <option value="drama">Drama</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div className="form-row">
                  <label>Description</label>
                  <textarea placeholder="Description" rows="4" required></textarea>
                </div>
              </div>

              {/* Section: Time And Place */}
              <div className="form-section">
                <h3 className="section-title">Time And Place</h3>
                <div className="form-row">
                  <label>Venue</label>
                  <select required>
                    <option value="">Venue</option>
                    <option value="lotus">Lotus Tower</option>
                    <option value="galle">Galle Face</option>
                    <option value="bmich">BMICH</option>
                  </select>
                </div>
                <div className="form-row multi-col">
                  <label>Date Time</label>
                  <div className="date-time-inputs">
                    <input 
                      type="date" 
                      required 
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                    <div className="time-group">
                      <span className="time-label">From</span>
                      <input type="time" required />
                    </div>
                    <div className="time-group">
                      <span className="time-label">To</span>
                      <input type="time" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="form-column">
              {/* Section: Uploads */}
              <div className="form-section">
                <h3 className="section-title">Uploads</h3>
                <div className="upload-box">
                  <div className="upload-icon">↑</div>
                  <p>Upload your Images</p>
                  <span className="upload-hint">Drag and Drop an image here or select one</span>
                  <button type="button" className="choose-img-btn">Choose Image</button>
                </div>
              </div>

              {/* Section: Ticket Pricing */}
              <div className="form-section">
                <h3 className="section-title">Ticket pricing</h3>
                
                <div className="ticket-tier-row">
                  <div className="tier-label">
                    <strong>Gold Tickets</strong>
                    <span>Tickets to issue</span>
                  </div>
                  <input type="number" placeholder="0" className="small-input" />
                  <div className="tier-price">
                    <span>Price per ticket</span>
                    <input type="text" placeholder="Price" />
                  </div>
                  <div className="tier-amount">
                    <span>Amount</span>
                    <input type="text" disabled />
                  </div>
                </div>

                <div className="ticket-tier-row">
                  <div className="tier-label">
                    <strong>Platinum</strong>
                    <span>Tickets to issue</span>
                  </div>
                  <input type="number" placeholder="0" className="small-input" />
                  <div className="tier-price">
                    <span>Price per ticket</span>
                    <input type="text" placeholder="Price" />
                  </div>
                  <div className="tier-amount">
                    <span>Amount</span>
                    <input type="text" disabled />
                  </div>
                </div>

                <div className="fee-summary">
                  <div className="fee-row">
                    <span>Usage Fee</span>
                    <strong>-40,000</strong>
                  </div>
                  <div className="fee-row total">
                    <span>Total</span>
                    <strong>0</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/admin')}>Cancel</button>
            <button type="submit" className="create-event-btn">Create Event</button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default AddEventPage;
