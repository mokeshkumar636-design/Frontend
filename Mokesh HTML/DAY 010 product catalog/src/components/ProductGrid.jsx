import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onAddToCart, onQuickView, resetFilters, compareList, onToggleCompare }) {
  if (products.length === 0) {
    return (
      <div className="empty-catalog-state">
        <div className="empty-state-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <h3>No matching products found</h3>
        <p>Try refining your search query, increasing your price limit, or changing categories.</p>
        <button className="reset-filters-btn" onClick={resetFilters}>
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          isCompared={compareList.some((item) => item.id === product.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}
