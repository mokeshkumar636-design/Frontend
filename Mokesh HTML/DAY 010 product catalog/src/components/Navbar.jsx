import React, { useState, useEffect } from 'react';

export default function Navbar({ searchQuery, setSearchQuery, cartCount, setIsCartOpen, triggerCartAnimate }) {
  return (
    <header className="site-header">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <div className="logo-wrapper" onClick={() => setSearchQuery('')}>
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="logo-text">AURA</span>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search premium goods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Cart Trigger Button */}
        <button 
          className={`cart-trigger-btn ${triggerCartAnimate ? 'animate' : ''}`}
          onClick={() => setIsCartOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Cart</span>
          <span className="cart-count-badge">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
