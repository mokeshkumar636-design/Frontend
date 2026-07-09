import React, { useState } from 'react';
import { playCheckoutSound } from '../utils/sounds';

export default function PaymentPage({ cartItems, onBackToCatalog, onClearCart }) {
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponStatus, setCouponStatus] = useState(''); // 'success', 'error', or ''
  
  // Checkout processing state
  const [paymentState, setPaymentState] = useState('form'); // 'form', 'processing', 'success'
  const [receiptNumber, setReceiptNumber] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Card number input formatter (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Allow only numbers
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  // Expiration date input formatter (adds '/' after MM)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Allow only numbers
    if (value.length > 4) value = value.slice(0, 4);
    
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setFormData((prev) => ({ ...prev, cardExpiry: formatted }));
  };

  // CVV formatter (max 3 digits)
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setFormData((prev) => ({ ...prev, cardCvv: value }));
  };

  // Apply Coupon logic
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'AURA10') {
      setDiscountPercent(10);
      setCouponStatus('success');
    } else {
      setCouponStatus('error');
      setDiscountPercent(0);
      setTimeout(() => setCouponStatus(''), 3000);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxedSubtotal = subtotal - discountAmount;
  const tax = taxedSubtotal * 0.08;
  const shipping = taxedSubtotal > 150 || taxedSubtotal === 0 ? 0 : 15;
  const total = taxedSubtotal + tax + shipping;

  // Submit payment
  const handlePay = (e) => {
    e.preventDefault();
    
    // Check if form is filled
    if (
      !formData.email || !formData.name || !formData.address || 
      !formData.city || !formData.zip || !formData.cardName || 
      !formData.cardNumber || !formData.cardExpiry || !formData.cardCvv
    ) {
      alert('Please fill out all checkout fields.');
      return;
    }

    // Go to processing state
    setPaymentState('processing');

    // Simulate processor loading delay
    setTimeout(() => {
      // Play celebratory sound
      playCheckoutSound();

      // Generate receipt tracking number
      const randomId = 'AUR-' + Math.floor(100000 + Math.random() * 900000);
      setReceiptNumber(randomId);
      
      setPaymentState('success');
      onClearCart();
    }, 2500);
  };

  if (paymentState === 'processing') {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          {/* Animated Spinner with category accent color */}
          <div className="payment-spinner"></div>
          <h2 style={{ marginTop: '24px', fontSize: '1.6rem' }}>Authorizing Transaction...</h2>
          <p style={{ opacity: 0.7, marginTop: '8px' }}>Encrypting credentials & establishing secure payment channel.</p>
        </div>
      </div>
    );
  }

  if (paymentState === 'success') {
    return (
      <div className="container" style={{ maxWidth: '650px', margin: '40px auto' }}>
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--card-shadow)',
          padding: '40px',
          textAlign: 'center'
        }}>
          {/* Success Check SVG */}
          <div className="success-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Order Confirmed!</h2>
          <p style={{ opacity: 0.8, marginBottom: '24px' }}>
            Thank you, {formData.name}. We have received your payment and are prepping your items for dispatch.
          </p>

          <div style={{
            background: 'var(--bg-gradient)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'left',
            marginBottom: '32px',
            border: '1px dashed var(--card-border)'
          }}>
            <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Transaction Summary
            </h4>
            <div className="summary-row" style={{ marginBottom: '8px' }}>
              <span>Receipt Code:</span>
              <strong style={{ color: 'var(--heading-color)' }}>{receiptNumber}</strong>
            </div>
            <div className="summary-row" style={{ marginBottom: '8px' }}>
              <span>Email Confirmed:</span>
              <span>{formData.email}</span>
            </div>
            <div className="summary-row" style={{ marginBottom: '8px' }}>
              <span>Delivery Destination:</span>
              <span>{formData.address}, {formData.city}, {formData.zip}</span>
            </div>
            <div className="summary-row total" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--card-border)' }}>
              <span>Amount Charged:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="checkout-btn" 
            onClick={onBackToCatalog}
            style={{ width: 'auto', padding: '14px 40px', display: 'inline-flex' }}
          >
            Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ margin: '40px auto' }}>
      {/* Return Back Button */}
      <button 
        className="compare-clear-btn" 
        onClick={onBackToCatalog}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.95rem' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Back to Product Grid</span>
      </button>

      <h2 style={{ fontSize: '2.2rem', marginBottom: '32px' }}>Secure Payment Checkout</h2>

      <div className="checkout-split-layout">
        
        {/* Left Column: Form Info */}
        <form className="checkout-billing-form" onSubmit={handlePay}>
          
          {/* Shipping Segment */}
          <div className="checkout-form-section">
            <h3 className="checkout-section-title">1. Shipping details</h3>
            
            <div className="form-input-grid">
              <div className="form-group-full">
                <label className="form-input-label">Email address</label>
                <input 
                  type="email" 
                  name="email"
                  className="checkout-form-input"
                  placeholder="name@domain.com"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div className="form-group-full">
                <label className="form-input-label">Recipient name</label>
                <input 
                  type="text" 
                  name="name"
                  className="checkout-form-input"
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div className="form-group-full">
                <label className="form-input-label">Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  className="checkout-form-input"
                  placeholder="123 Premium Way"
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div>
                <label className="form-input-label">City</label>
                <input 
                  type="text" 
                  name="city"
                  className="checkout-form-input"
                  placeholder="Metropolis"
                  value={formData.city} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div>
                <label className="form-input-label">ZIP / Postal Code</label>
                <input 
                  type="text" 
                  name="zip"
                  className="checkout-form-input"
                  placeholder="90210"
                  value={formData.zip} 
                  onChange={handleInputChange} 
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Card Segment */}
          <div className="checkout-form-section" style={{ marginTop: '32px' }}>
            <h3 className="checkout-section-title">2. Card payment details</h3>
            
            <div className="form-input-grid">
              <div className="form-group-full">
                <label className="form-input-label">Cardholder Name</label>
                <input 
                  type="text" 
                  name="cardName"
                  className="checkout-form-input"
                  placeholder="John Doe"
                  value={formData.cardName} 
                  onChange={handleInputChange} 
                  required
                />
              </div>

              <div className="form-group-full">
                <label className="form-input-label">Credit Card Number</label>
                <input 
                  type="text" 
                  name="cardNumber"
                  className="checkout-form-input"
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber} 
                  onChange={handleCardNumberChange} 
                  required
                />
              </div>

              <div>
                <label className="form-input-label">Expiry (MM/YY)</label>
                <input 
                  type="text" 
                  name="cardExpiry"
                  className="checkout-form-input"
                  placeholder="12/28"
                  value={formData.cardExpiry} 
                  onChange={handleExpiryChange} 
                  required
                />
              </div>

              <div>
                <label className="form-input-label">CVV / CVC</label>
                <input 
                  type="password" 
                  name="cardCvv"
                  className="checkout-form-input"
                  placeholder="***"
                  value={formData.cardCvv} 
                  onChange={handleCvvChange} 
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="checkout-btn" style={{ marginTop: '40px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span>Pay Securely ${total.toFixed(2)}</span>
          </button>
        </form>

        {/* Right Column: Order Summary */}
        <div className="checkout-order-summary">
          <h3 className="checkout-section-title" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '12px' }}>
            Order Summary
          </h3>
          
          {/* Item List */}
          <div className="summary-items-box">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item-row">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} className="summary-item-thumb" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--heading-color)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Promo code box */}
          <div className="promo-code-container">
            <input 
              type="text"
              placeholder="Promo Code (AURA10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="checkout-form-input"
              style={{ fontSize: '0.85rem', padding: '10px 14px' }}
            />
            <button type="button" className="add-cart-btn" onClick={applyCoupon} style={{ borderRadius: 'var(--radius-btn)' }}>
              Apply
            </button>
          </div>
          
          {couponStatus === 'success' && (
            <p className="coupon-status success">✓ 10% coupon successfully applied!</p>
          )}
          {couponStatus === 'error' && (
            <p className="coupon-status error">✗ Invalid coupon code.</p>
          )}

          {/* Pricing calculations */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="summary-row">
              <span>Cart Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="summary-row" style={{ color: '#81B29A', fontWeight: 600 }}>
                <span>Discount (10% off)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Sales Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-row total" style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
              <span>Total Bill</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{
            marginTop: '32px',
            fontSize: '0.8rem',
            opacity: 0.7,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#81B29A" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>SSL Secured 256-Bit Payment Gateway</span>
          </div>
        </div>

      </div>
    </div>
  );
}
