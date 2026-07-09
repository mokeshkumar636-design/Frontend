import React, { useEffect } from 'react';

export default function ProductCompareModal({ isOpen, onClose, compareList, onAddToCart }) {
  if (!isOpen) return null;

  // Handle closing on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Star rating helper
  const renderStars = (rating) => {
    return (
      <span style={{ color: '#FFC107', fontSize: '0.9rem' }}>
        {'★'.repeat(Math.floor(rating))}
        {rating % 1 !== 0 ? '½' : ''}
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '4px' }}>
          ({rating})
        </span>
      </span>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="compare-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Comparison">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="compare-title">Compare Products</h2>

        {compareList.length === 0 ? (
          <p style={{ textAlign: 'center', margin: '40px 0', opacity: 0.7 }}>
            No products selected for comparison. Close this modal and select items to compare.
          </p>
        ) : (
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ background: 'var(--bg-gradient)' }}></th>
                  {compareList.map((prod) => (
                    <th key={prod.id}>
                      <div className="compare-product-header">
                        <img className="compare-prod-img" src={prod.image} alt={prod.name} />
                        <div className="compare-prod-title">{prod.name}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="property-name">Price</td>
                  {compareList.map((prod) => (
                    <td key={prod.id} style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--heading-color)' }}>
                      ${prod.price.toFixed(2)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="property-name">Rating</td>
                  {compareList.map((prod) => (
                    <td key={prod.id}>{renderStars(prod.rating)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="property-name">Category</td>
                  {compareList.map((prod) => (
                    <td key={prod.id} style={{ textTransform: 'capitalize' }}>
                      {prod.category}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="property-name">Description</td>
                  {compareList.map((prod) => (
                    <td key={prod.id} style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {prod.description}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="property-name">Key Features</td>
                  {compareList.map((prod) => (
                    <td key={prod.id}>
                      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                        {prod.details.map((detail, idx) => (
                          <li key={idx} style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--accent)' }}>✦</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="property-name">Actions</td>
                  {compareList.map((prod) => (
                    <td key={prod.id}>
                      <button 
                        className="modal-add-cart-btn" 
                        onClick={() => onAddToCart(prod)}
                        style={{ padding: '10px 16px', fontSize: '0.85rem' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span>Add to Cart</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
