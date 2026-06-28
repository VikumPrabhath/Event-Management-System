import React, { useState } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './TicketBooking.css';

function TicketBooking({ event, onClose, theme, toggleTheme, user, onOpenAuth }) {
  const [step, setStep] = useState(1);
  const [ticketCounts, setTicketCounts] = useState({
    gold: 0,
    platinum: 0,
    goldTable: 0,
    platinumTable: 0
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nic: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [agreed, setAgreed] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  const eventTitle = event?.title || 'Marians Live at the edge';

  const prices = {
    gold: 5000,
    platinum: 7500,
    goldTable: 40000,
    platinumTable: 60000
  };

  const handleCountChange = (type, delta) => {
    setTicketCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const subTotal = (ticketCounts.gold * prices.gold) +
                   (ticketCounts.platinum * prices.platinum) +
                   (ticketCounts.goldTable * prices.goldTable) +
                   (ticketCounts.platinumTable * prices.platinumTable);

  const convenienceFee = subTotal > 0 ? subTotal * 0.01 : 0;
  const grandTotal = subTotal + convenienceFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = () => {
    if (subTotal === 0) {
      alert('Please select at least one ticket to proceed.');
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please accept the Terms and Conditions to proceed.');
      return;
    }
    setBookingComplete(true);
  };

  return (
    <div className="booking-full-page">
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onOpenAuth={onOpenAuth} />

      <div className="booking-wizard-wrapper">
        {/* Close Button / Back to main view */}
        <button className="booking-close-btn" onClick={onClose} title="Close booking">✕</button>

        {bookingComplete ? (
          <div className="booking-success-card">
            <h2>Booking Successful!</h2>
            <p>Thank you, <strong>{formData.firstName || 'Customer'}</strong>. Your tickets for <strong>{eventTitle}</strong> have been confirmed.</p>
            <div className="success-summary-details">
              <div><span>Total Paid:</span> <strong>{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</strong></div>
              <div><span>Email Confirmation:</span> <strong>{formData.email || 'customer@example.com'}</strong></div>
            </div>
            <button className="orange-finish-btn" onClick={onClose}>Return to Home</button>
          </div>
        ) : (
          <>
            {/* Top Wizard Stepper */}
            <div className="wizard-stepper-row">
              <div className={`stepper-item ${step === 1 ? 'active' : 'completed'}`}>
                <div className="step-circle">1</div>
                <span className="step-label">Select Tickets</span>
              </div>
              <div className="stepper-line"></div>
              <div className={`stepper-item ${step === 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span className="step-label">Payment</span>
              </div>
            </div>

            {step === 1 ? (
              /* STEP 1: SELECT TICKETS */
              <div className="step-one-container">
                <div className="step-one-grid">
                  {/* Left Column Poster */}
                  <div className="poster-column">
                    <div className="square-event-poster">
                      <div className="poster-art-placeholder">
                        <span>{eventTitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Selection Table */}
                  <div className="selection-column">
                    <h2 className="booking-event-title">{eventTitle}</h2>
                    <h3 className="section-subtitle">Choose your Tickets</h3>

                    <div className="tickets-table-wrapper">
                      <div className="table-header-row">
                        <span className="col-cat">Category</span>
                        <span className="col-price">Price</span>
                        <span className="col-qty">No. of Tickets</span>
                        <span className="col-amt">Amount</span>
                      </div>

                      {/* Gold Row */}
                      <div className="table-data-row">
                        <span className="col-cat cat-name">Gold</span>
                        <span className="col-price">5000.00 LKR</span>
                        <div className="col-qty qty-controls">
                          <button onClick={() => handleCountChange('gold', -1)}>-</button>
                          <span>{ticketCounts.gold}</span>
                          <button onClick={() => handleCountChange('gold', 1)}>+</button>
                        </div>
                        <span className="col-amt">{(ticketCounts.gold * prices.gold).toFixed(2)} LKR</span>
                      </div>

                      {/* Platinum Row */}
                      <div className="table-data-row">
                        <span className="col-cat cat-name">Platinum</span>
                        <span className="col-price">7500.00 LKR</span>
                        <div className="col-qty qty-controls">
                          <button onClick={() => handleCountChange('platinum', -1)}>-</button>
                          <span>{ticketCounts.platinum}</span>
                          <button onClick={() => handleCountChange('platinum', 1)}>+</button>
                        </div>
                        <span className="col-amt">{(ticketCounts.platinum * prices.platinum).toFixed(2)} LKR</span>
                      </div>

                      {/* Gold Table Row */}
                      <div className="table-data-row">
                        <span className="col-cat cat-name">Gold Table (6 PAX)</span>
                        <span className="col-price">40000.00 LKR</span>
                        <div className="col-qty qty-controls">
                          <button onClick={() => handleCountChange('goldTable', -1)}>-</button>
                          <span>{ticketCounts.goldTable}</span>
                          <button onClick={() => handleCountChange('goldTable', 1)}>+</button>
                        </div>
                        <span className="col-amt">{(ticketCounts.goldTable * prices.goldTable).toFixed(2)} LKR</span>
                      </div>

                      {/* Platinum Table Row */}
                      <div className="table-data-row">
                        <span className="col-cat cat-name">Platinum Table (6 PAX)</span>
                        <span className="col-price">60000.00 LKR</span>
                        <div className="col-qty qty-controls">
                          <button onClick={() => handleCountChange('platinumTable', -1)}>-</button>
                          <span>{ticketCounts.platinumTable}</span>
                          <button onClick={() => handleCountChange('platinumTable', 1)}>+</button>
                        </div>
                        <span className="col-amt">{(ticketCounts.platinumTable * prices.platinumTable).toFixed(2)} LKR</span>
                      </div>

                      {/* Total Summary Row */}
                      <div className="table-total-row">
                        <span className="total-label">Total</span>
                        <span className="total-val">{subTotal.toFixed(2)} LKR</span>
                      </div>
                    </div>

                    <div className="step-one-footer">
                      <button className="orange-proceed-btn" onClick={handleProceedToPayment}>
                        Proceed to Checkout &gt;&gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* STEP 2: BILLING & PAYMENT */
              <form onSubmit={handleFinalSubmit} className="step-two-container">
                <div className="step-two-grid">
                  {/* Left Column Billing Details */}
                  <div className="billing-column">
                    <h3 className="column-title">Billing Details</h3>
                    <div className="billing-form-fields">
                      <div className="input-field">
                        <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="First Name" />
                      </div>
                      <div className="input-field">
                        <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" />
                      </div>
                      <div className="input-field">
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email Address" />
                      </div>
                      <div className="input-field">
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Phone No" />
                      </div>
                      <div className="input-field">
                        <input type="text" name="nic" required value={formData.nic} onChange={handleInputChange} placeholder="NIC / Passport /Driving License" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column Booking Summary & Payment Methods */}
                  <div className="summary-column">
                    <h3 className="column-title">Booking Summary</h3>
                    <div className="summary-box">
                      {ticketCounts.gold > 0 && (
                        <div className="sum-row">
                          <span>{ticketCounts.gold} X Gold Ticket(s)</span>
                          <span>{(ticketCounts.gold * prices.gold).toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                        </div>
                      )}
                      {ticketCounts.platinum > 0 && (
                        <div className="sum-row">
                          <span>{ticketCounts.platinum} X Platinum Ticket(s)</span>
                          <span>{(ticketCounts.platinum * prices.platinum).toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                        </div>
                      )}
                      {ticketCounts.goldTable > 0 && (
                        <div className="sum-row">
                          <span>{ticketCounts.goldTable} X Gold Table(s)</span>
                          <span>{(ticketCounts.goldTable * prices.goldTable).toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                        </div>
                      )}
                      {ticketCounts.platinumTable > 0 && (
                        <div className="sum-row">
                          <span>{ticketCounts.platinumTable} X Platinum Table(s)</span>
                          <span>{(ticketCounts.platinumTable * prices.platinumTable).toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                        </div>
                      )}

                      <div className="sum-row divider-top">
                        <span>Sub Total</span>
                        <span>{subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                      </div>
                      <div className="sum-row">
                        <span>Convenience Fee (1%)</span>
                        <span>+ {convenienceFee.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                      </div>
                      <div className="sum-row grand-total-row">
                        <span>Total</span>
                        <span>{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                      </div>
                    </div>

                    <div className="payment-method-section">
                      <h4 className="pay-method-title">Choose A Payment Method</h4>

                      <label className={`pay-option-row ${paymentMethod === 'visa' ? 'selected' : ''}`}>
                        <input type="radio" name="payment" value="visa" checked={paymentMethod === 'visa'} onChange={() => setPaymentMethod('visa')} />
                        <div className="pay-label-content">
                          <span>Pay via VISA / Master</span>
                          <div className="pay-badges">
                            <span className="badge-card visa-badge">VISA</span>
                            <span className="badge-card master-badge">Mastercard</span>
                          </div>
                        </div>
                      </label>

                      <label className={`pay-option-row ${paymentMethod === 'koko' ? 'selected' : ''}`}>
                        <input type="radio" name="payment" value="koko" checked={paymentMethod === 'koko'} onChange={() => setPaymentMethod('koko')} />
                        <div className="pay-label-content">
                          <span>Pay via KOKO (Buy Now Pay Later)</span>
                          <span className="badge-card koko-badge">KOKO</span>
                        </div>
                      </label>

                      <label className={`pay-option-row ${paymentMethod === 'other' ? 'selected' : ''}`}>
                        <input type="radio" name="payment" value="other" checked={paymentMethod === 'other'} onChange={() => setPaymentMethod('other')} />
                        <div className="pay-label-content">
                          <span>Pay via AMEX, FriMi and Other</span>
                          <span className="badge-card other-badge">AMEX / FriMi</span>
                        </div>
                      </label>

                      <div className="terms-checkbox-row">
                        <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                        <label htmlFor="terms">* I accept and agree to Terms and Conditions</label>
                      </div>
                    </div>

                    <div className="step-two-buttons">
                      <button type="button" className="gray-back-btn" onClick={() => setStep(1)}>
                        &lt; Back
                      </button>
                      <button type="submit" className="orange-pay-btn">
                        Proceed to pay &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default TicketBooking;
