import React, { useState, useEffect } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './TicketBooking.css';

function TicketBooking({ event, onClose, theme, toggleTheme, user, onOpenAuth }) {
  const [step, setStep] = useState(1);
  const [ticketCounts, setTicketCounts] = useState({});

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.mobileNo || '',
    nic: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [agreed, setAgreed] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const eventTitle = event?.title || 'Marians Live at the edge';

  // Dynamic ticket tiers or fallbacks
  const tiers = event?.ticketTiers && event.ticketTiers.length > 0 ? event.ticketTiers : [
    { name: 'Gold', capacity: 100, price: 5000, sold: 0 },
    { name: 'Platinum', capacity: 50, price: 7500, sold: 0 }
  ];

  // Initialize counts for tiers
  useEffect(() => {
    const counts = {};
    tiers.forEach(t => {
      counts[t.name] = 0;
    });
    setTicketCounts(counts);
  }, [event]);

  const handleCountChange = (name, delta, tierCapacity, tierSold) => {
    setTicketCounts(prev => {
      const current = prev[name] || 0;
      const next = current + delta;
      const available = tierCapacity - (tierSold || 0);
      
      if (next < 0) return prev;
      if (next > available) {
        alert(`Cannot select more than available tickets. Only ${available} remaining.`);
        return prev;
      }
      return { ...prev, [name]: next };
    });
  };

  const subTotal = tiers.reduce((sum, tier) => {
    return sum + ((ticketCounts[tier.name] || 0) * tier.price);
  }, 0);

  // Early Bird Discount Logic
  const totalTicketsSelected = Object.values(ticketCounts).reduce((sum, q) => sum + q, 0);
  const isEarlyBirdEligible = event && event.earlyBirdLimit && (event.ticketsSold || 0) < event.earlyBirdLimit;
  const discountPercent = isEarlyBirdEligible ? (event.earlyBirdDiscount || 0) : 0;
  const discountAmount = subTotal * (discountPercent / 100);

  const convenienceFee = subTotal > 0 ? (subTotal - discountAmount) * 0.01 : 0;
  const grandTotal = (subTotal - discountAmount) + convenienceFee;

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

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please accept the Terms and Conditions to proceed.');
      return;
    }

    setIsProcessing(true);

    // MOCK PAYMENT GATEWAY
    // Simulate network delay and gateway processing (e.g., 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));
    // As per user request: "even gateway failed we trigeer payment as ssuceess and book the tiket"
    // So we ignore potential simulated failures and proceed to create the booking.

    const bookingPayload = {
      userId: user?.id || 'anonymous',
      eventId: event?.id || 'event-id',
      eventTitle: eventTitle,
      selectedTiers: ticketCounts,
      customerFirstName: formData.firstName,
      customerLastName: formData.lastName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      customerNic: formData.nic,
      totalAmount: grandTotal,
      paymentMethod: paymentMethod,
      status: 'Confirmed'
    };

    try {
      const res = await fetch('http://localhost:8081/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Booking failed on server');
      }
      setBookingComplete(true);
    } catch (err) {
      console.error(err);
      setBookingError(err.message || 'Payment or Booking failed. Tickets may be sold out.');
    } finally {
      setIsProcessing(false);
    }
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
              {discountAmount > 0 && <div style={{ color: '#2ecc71' }}><span>Early Bird Saved ({discountPercent}%):</span> <strong>{discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</strong></div>}
              <div><span>Email Confirmation:</span> <strong>{formData.email || 'customer@example.com'}</strong></div>
            </div>
            <button className="orange-finish-btn" onClick={onClose}>Return to Home</button>
          </div>
        ) : (
          <>
            {/* Top Wizard Stepper */}
            {bookingError && (
              <div style={{ padding: '15px', background: '#ffcccc', color: '#ff0000', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                {bookingError}
              </div>
            )}
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

                    {isEarlyBirdEligible && (
                      <div style={{ background: 'rgba(46, 204, 113, 0.15)', border: '1px solid #2ecc71', color: '#2ecc71', padding: '10px 15px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px' }}>
                        🔥 <strong>Early Bird Active!</strong> Get <strong>{discountPercent}% OFF</strong> on your tickets (Limit: first {event.earlyBirdLimit} tickets).
                      </div>
                    )}

                    <div className="tickets-table-wrapper">
                      <div className="table-header-row">
                        <span className="col-cat">Category</span>
                        <span className="col-price">Price</span>
                        <span className="col-qty">No. of Tickets</span>
                        <span className="col-amt">Amount</span>
                      </div>

                      {tiers.map((tier, idx) => (
                        <div key={idx} className="table-data-row">
                          <span className="col-cat cat-name">{tier.name} <br/><span style={{fontSize: '11px', color: '#8b90a0'}}>(Remaining: {tier.capacity - (tier.sold || 0)})</span></span>
                          <span className="col-price">{tier.price.toFixed(2)} LKR</span>
                          <div className="col-qty qty-controls">
                            <button onClick={() => handleCountChange(tier.name, -1, tier.capacity, tier.sold)}>-</button>
                            <span>{ticketCounts[tier.name] || 0}</span>
                            <button onClick={() => handleCountChange(tier.name, 1, tier.capacity, tier.sold)}>+</button>
                          </div>
                          <span className="col-amt">{((ticketCounts[tier.name] || 0) * tier.price).toFixed(2)} LKR</span>
                        </div>
                      ))}

                      {/* Total Summary Row */}
                      <div className="table-total-row">
                        <span className="total-label">Sub Total</span>
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
                      {tiers.map((tier, idx) => {
                        const qty = ticketCounts[tier.name] || 0;
                        if (qty === 0) return null;
                        return (
                          <div key={idx} className="sum-row">
                            <span>{qty} X {tier.name}</span>
                            <span>{(qty * tier.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                          </div>
                        );
                      })}

                      <div className="sum-row divider-top">
                        <span>Sub Total</span>
                        <span>{subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="sum-row" style={{ color: '#2ecc71' }}>
                          <span>Early Bird Discount ({discountPercent}%)</span>
                          <span>- {discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR</span>
                        </div>
                      )}
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

                      {/* Stripe Checkout Mock VISA */}
                      {paymentMethod === 'visa' && (
                        <div className="mock-card-details" style={{ margin: '0 0 15px 0', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                          <StripeCheckout
                            stripeKey="pk_test_TYooMQauvdEDq54NiTphI7jx" // Public Stripe test key
                            token={async (token) => {
                              // We just use this as a trigger to proceed with the booking!
                              const syntheticEvent = { preventDefault: () => {} };
                              await handleFinalSubmit(syntheticEvent);
                            }}
                            name={eventTitle}
                            description={`Total: ${grandTotal.toLocaleString()} LKR`}
                            amount={grandTotal * 100} // Stripe expects amounts in cents
                            currency="LKR"
                            email={formData.email}
                            allowRememberMe={false}
                          >
                            <button type="button" className="orange-pay-btn" style={{ width: '100%' }}>
                              Pay Securely with Stripe
                            </button>
                          </StripeCheckout>
                        </div>
                      )}

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
                      <button type="button" className="gray-back-btn" onClick={() => setStep(1)} disabled={isProcessing}>
                        &lt; Back
                      </button>
                      <button type="submit" className="orange-pay-btn" disabled={isProcessing} style={{ opacity: isProcessing ? 0.7 : 1 }}>
                        {isProcessing ? 'Processing Payment...' : 'Proceed to pay >'}
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
