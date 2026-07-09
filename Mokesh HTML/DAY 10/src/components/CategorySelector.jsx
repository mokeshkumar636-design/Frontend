import React from 'react';
import { CATEGORIES } from '../data/products';

export default function CategorySelector({ activeCategory, setActiveCategory }) {
  const categoriesList = Object.values(CATEGORIES);

  // SVG Icons mapped to category IDs
  const getCategoryIcon = (id) => {
    switch (id) {
      case 'foods':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            {/* Alternative Food Icon: Chef Hat / Bowl */}
            <path d="M12 2A9 9 0 0 0 3 11v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1A9 9 0 0 0 12 2z"/>
            <path d="M12 14v4M8 14v2M16 14v2M6 18h12a2 2 0 0 1 2 2v0H4v0a2 2 0 0 1 2-2z"/>
          </svg>
        );
      case 'accessories':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7"></circle>
            <polyline points="12 9 12 12 13.5 13.5"></polyline>
            <path d="M16.51 7.5a9 9 0 0 0-9 0M12 2v3M12 19v3"/>
          </svg>
        );
      case 'sports':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        );
      case 'dress':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="category-navbar">
      <div className="category-tabs">
        {categoriesList.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {getCategoryIcon(cat.id)}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
