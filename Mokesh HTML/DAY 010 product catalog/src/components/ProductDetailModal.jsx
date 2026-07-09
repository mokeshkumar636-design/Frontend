import React, { useState, useEffect } from 'react';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Reset tab to overview whenever a new product is selected
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Handle closing on pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent scroll propagation to body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const { name, price, rating, reviews, badge, description, image, details, category } = product;

  // Generate stars helper for reviews
  const renderStars = (ratingVal) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} style={{ position: 'relative', display: 'inline-block', width: '14px', height: '14px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute' }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <div style={{ position: 'absolute', width: '7px', height: '14px', overflow: 'hidden' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.3 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      }
    }
    return stars;
  };

  // Generate category-personalized mock reviews
  const getMockReviews = () => {
    switch (category) {
      case 'foods':
        return [
          { author: 'Chef Marcus L.', rating: 5, date: 'July 05, 2026', text: `Incredible flavor profile! This ${name} is absolute premium quality. It elevates my gourmet cheese boards instantly.` },
          { author: 'Sophia V.', rating: 5, date: 'June 29, 2026', text: `Tastes incredibly fresh and authentic. Sourced sustainably, and the organic packing is a huge plus.` },
          { author: 'Nathan D.', rating: 4, date: 'June 18, 2026', text: `Very high quality, though shipping took an extra day. Customer service was excellent, and the product arrived in perfect temperature control.` }
        ];
      case 'accessories':
        return [
          { author: 'Arthur K. (Designer)', rating: 5, date: 'July 07, 2026', text: `Exceptional craftsmanship. The minimal styling of this ${name} matches my aesthetic perfectly. Very durable.` },
          { author: 'Olivia M.', rating: 5, date: 'July 01, 2026', text: `Absolutely stunning! It looks even better in person. Received so many compliments already.` },
          { author: 'Ethan H.', rating: 4, date: 'June 22, 2026', text: `Premium construction. The materials feel solid and heavy. The clasp and edges are finished extremely fine.` }
        ];
      case 'sports':
        return [
          { author: 'Coach Reynolds', rating: 5, date: 'July 06, 2026', text: `Top-tier performance gear. The ergonomics of the ${name} are outstanding. Helps me push my training to the next level.` },
          { author: 'Mia C. (Triathlete)', rating: 5, date: 'June 30, 2026', text: `Ultra-lightweight and highly responsive. Best training purchase I've made this year.` },
          { author: 'Jake W.', rating: 4, date: 'June 25, 2026', text: `Excellent utility. Very solid build. Only feedback is that the accent color is very bright, but that's great for visibility!` }
        ];
      case 'dress':
        return [
          { author: 'Gabrielle D.', rating: 5, date: 'July 08, 2026', text: `Beautiful drape and structure! The fabric feels breathable yet heavy enough to hold its shape. Fits true to size.` },
          { author: 'Lucas S.', rating: 5, date: 'July 02, 2026', text: `Outstanding quality. You can tell they pay attention to the stitching and details. Worth the investment.` },
          { author: 'Chloe P.', rating: 4, date: 'June 27, 2026', text: `Very elegant silhouette. The colors match the photoshoot photos perfectly. Needs slight steaming, but it is gorgeous.` }
        ];
      default:
        return [];
    }
  };

  // Get shipping details
  const getShippingDetails = () => {
    switch (category) {
      case 'foods':
        return "Ships in climate-controlled temperature-insulated packaging. Next day delivery available to keep ingredients ultra-fresh. Free standard delivery on orders over $150.";
      case 'accessories':
        return "Ships in double-boxed secure signature-required packaging. Fully insured in transit. Free 30-day returns and lifetime warranty on structural defects.";
      case 'sports':
        return "Ships in eco-friendly cardboard structures. Express 2-day delivery available. 100% satisfaction athletic trial guarantee. Easy return shipping slip included.";
      case 'dress':
        return "Ships in customized acid-free tissue paper and linen garment protection pouches. Complimentary premium hanger included. Free sizing exchanges within 30 days.";
      default:
        return "";
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-grid">
          {/* Left Column: Image */}
          <div className="modal-img-box">
            <img className="modal-img" src={image} alt={name} />
          </div>

          {/* Right Column: Details */}
          <div className="modal-details-box">
            {badge && <span className="modal-tag">{badge}</span>}
            <h2 className="modal-title">{name}</h2>

            <div className="modal-rating-row">
              <div className="star-rating">{renderStars(rating)}</div>
              <span className="review-count">({reviews} customer reviews)</span>
            </div>

            <div className="modal-price">${price.toFixed(2)}</div>

            {/* Modal Tabs system */}
            <div className="modal-tabs-header">
              <button 
                className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews})
              </button>
              <button 
                className={`modal-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping
              </button>
            </div>

            {/* Tab Pane contents */}
            <div className="tab-pane-content" style={{ flex: 1, minHeight: '150px' }}>
              {activeTab === 'overview' && (
                <div>
                  <p className="modal-desc" style={{ marginBottom: '16px' }}>{description}</p>
                  {details && details.length > 0 && (
                    <>
                      <h4 className="modal-specs-title">Key Specifications</h4>
                      <ul className="modal-specs-list">
                        {details.map((detail, idx) => (
                          <li key={idx}>
                            <span className="spec-bullet">✦</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {getMockReviews().map((rev, idx) => (
                    <div className="review-item" key={idx}>
                      <div className="review-header">
                        <span className="review-author">{rev.author}</span>
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', color: '#FFC107', marginBottom: '6px', fontSize: '0.8rem' }}>
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </div>
                      <p className="review-text">{rev.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h4 className="modal-specs-title" style={{ marginBottom: '12px' }}>Thematic Dispatch Policy</h4>
                  <p className="modal-desc">{getShippingDetails()}</p>
                  <p className="modal-desc" style={{ marginTop: '12px', fontSize: '0.85rem', opacity: 0.7 }}>
                    Note: Dispatch times are calibrated to safeguard the specific requirements of our categories.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: '24px' }}>
              <button 
                className="modal-add-cart-btn"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Add to Shopping Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
