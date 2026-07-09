import React, { useEffect } from 'react';

export default function CartDrawer({ isOpen, onClose, cartItems, updateQuantity, removeItem, checkout }) {
  
  // Close drawer on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15; // Free shipping above $150
  const total = subtotal + tax + shipping;

  return (
    <>
      {/* Backdrop Layer */}
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Cart Side Drawer Panel */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">Shopping Cart</h3>
          <button className="cart-close-trigger" onClick={onClose} aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content list */}
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <div className="empty-cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.9rem', opacity: '0.8' }}>Add premium items from the catalog to get started.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item-card" key={item.id}>
                {/* Item Thumbnail */}
                <div className="cart-item-img-box">
                  <img className="cart-item-img" src={item.image} alt={item.name} />
                </div>

                {/* Item Details */}
                <div className="cart-item-info">
                  <span className="cart-item-category">{item.category}</span>
                  <h4 className="cart-item-name">{item.name}</h4>
                  
                  {/* Quantity Controller & Price */}
                  <div className="cart-item-actions">
                    <div className="quantity-controller">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="quantity-val">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Remove CTA */}
                  <button className="remove-item-btn" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculations & Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-row total">
              <span>Total Due</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={checkout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <span>Proceed to Checkout</span>
            </button>
          </div>
        )}

      </div>
    </>
  );
}
