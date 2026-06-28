import React, { useState } from 'react';
import './TicketBooking.css';

function TicketBooking({ event, onClose }) {
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState(event?.selectedTier?.name || 'Standard Seating');
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [bookingComplete, setBookingComplete] = useState(false);

  const pricePerTicket = selectedTier.includes('VIP') ? 5000 : selectedTier.includes('Balcony') ? 2000 : 3500;
  const totalPrice = pricePerTicket * quantity;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setBookingComplete(true);
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-content">
        <button className="close-modal-btn" onClick={onClose}>✕</button>

        {bookingComplete ? (
          <div className="booking-success-view">
            <div className="success-icon">🎉</div>
            <h2>Booking Confirmed!</h2>
            <p>Thank you, <strong>{formData.firstName || 'Customer'}</strong>! Your tickets for <strong>{event?.title || 'Event'}</strong> have been booked successfully.</p>
            <div className="ticket-summary-box">
              <div><span>Tickets:</span> <strong>{quantity} x {selectedTier}</strong></div>
              <div><span>Total Paid:</span> <strong>LKR {totalPrice.toLocaleString()}</strong></div>
              <div><span>Confirmation Sent To:</span> <strong>{formData.email || 'your email'}</strong></div>
            </div>
            <button className="done-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            {/* Modal Step Header */}
            <div className="modal-header-tabs">
              <div className={`step-tab ${step === 1 ? 'active' : ''}`}>1. Select Tickets</div>
              <div className="step-arrow">→</div>
              <div className={`step-tab ${step === 2 ? 'active' : ''}`}>2. Checkout Details</div>
            </div>

            {step === 1 ? (
              <div className="booking-step-one">
                <h3 className="step-title">{event?.title || 'Marians Live at the Edge'}</h3>
                
                <div className="form-group">
                  <label>Select Category</label>
                  <select 
                    value={selectedTier} 
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="modal-select"
                  >
                    <option value="Balcony / General">Balcony / General (LKR 2,000)</option>
                    <option value="Standard Seating">Standard Seating (LKR 3,500)</option>
                    <option value="VIP Front Row">VIP Front Row (LKR 5,000)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Quantity</label>
                  <div className="quantity-counter">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>

                <div className="price-summary-row">
                  <span>Total Amount:</span>
                  <strong className="total-price-text">LKR {totalPrice.toLocaleString()}</strong>
                </div>

                <button className="next-step-btn" onClick={() => setStep(2)}>
                  Proceed to Checkout →
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirm} className="booking-step-two">
                <h3 className="step-title">Customer Information</h3>
                
                <div className="form-row-two">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="+94 77 123 4567" />
                </div>

                <div className="form-group">
                  <label>Select Payment Method</label>
                  <div className="payment-options">
                    <div className={`pay-card ${paymentMethod === 'visa' ? 'selected' : ''}`} onClick={() => setPaymentMethod('visa')}>
                      💳 Card (Visa/Master)
                    </div>
                    <div className={`pay-card ${paymentMethod === 'koko' ? 'selected' : ''}`} onClick={() => setPaymentMethod('koko')}>
                      🛍️ Koko Pay Later
                    </div>
                  </div>
                </div>

                <div className="checkout-footer">
                  <button type="button" className="back-step-btn" onClick={() => setStep(1)}>← Back</button>
                  <button type="submit" className="confirm-pay-btn">Pay LKR {totalPrice.toLocaleString()}</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TicketBooking;
