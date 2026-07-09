import React from 'react';

export default function ProductCard({ product, onAddToCart, onQuickView, isCompared, onToggleCompare }) {
  const { name, price, rating, reviews, badge, description, image } = product;

  // Generate star SVGs based on rating
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
          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="product-card">
      {badge && <span className="card-badge">{badge}</span>}

      {/* Image Container with Hover Overlay */}
      <div className="product-card-img-box">
        <img className="product-card-img" src={image} alt={name} loading="lazy" />
        <div className="card-quickview-overlay">
          <button className="quickview-btn" onClick={() => onQuickView(product)}>
            Quick View
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="product-card-body">
        {/* Rating Row */}
        <div className="card-rating-row">
          <div className="star-rating">{renderStars(rating)}</div>
          <span className="review-count">({reviews})</span>
        </div>

        {/* Title & Description */}
        <h3 className="product-card-title">{name}</h3>
        <p className="product-card-desc">{description}</p>

        {/* Footer Actions */}
        <div className="card-footer">
          <span className="card-price">${price.toFixed(2)}</span>
          <button className="add-cart-btn" onClick={() => onAddToCart(product)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add</span>
          </button>
        </div>

        {/* Compare Checkbox */}
        <label className="compare-checkbox-container" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => onToggleCompare(product)}
          />
          <span>Compare Item</span>
        </label>
      </div>
    </div>
  );
}
