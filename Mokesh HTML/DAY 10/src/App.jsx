import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from './data/products';
import Navbar from './components/Navbar';
import CategorySelector from './components/CategorySelector';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import BackgroundEffect from './components/BackgroundEffect';
import ProductCompareModal from './components/ProductCompareModal';
import PaymentPage from './components/PaymentPage';
import { playThemeSound, playAddToCartSound } from './utils/sounds';

function App() {
  // State variables
  const [view, setView] = useState('catalog'); // 'catalog' or 'checkout'
  const [activeCategory, setActiveCategory] = useState('foods');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(350);
  const [sortBy, setSortBy] = useState('featured');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [triggerCartAnimate, setTriggerCartAnimate] = useState(false);
  
  // Product Comparison States
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Sync page category theme to body class
  useEffect(() => {
    const activeTheme = CATEGORIES[activeCategory].themeClass;
    
    // Remove all category theme classes
    Object.values(CATEGORIES).forEach((cat) => {
      document.body.classList.remove(cat.themeClass);
    });

    // Add active theme class
    document.body.classList.add(activeTheme);
  }, [activeCategory]);

  // Reset filter values
  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange(350);
    setSortBy('featured');
  };

  // Add Item to Shopping Cart
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    // Play synthesis audio pluck
    playAddToCartSound();

    // Fire cart wiggle micro-animation
    setTriggerCartAnimate(true);
    setTimeout(() => setTriggerCartAnimate(false), 500);
  };

  // Update Item Quantity in Cart
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  // Remove Item from Cart
  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Open Payment/Checkout View
  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
  };

  // Toggle item in comparison list (max 3 items)
  const handleToggleCompare = (product) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        if (prev.length >= 3) {
          alert('Comparison Limit: You can select a maximum of 3 items to compare side-by-side.');
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  // Live search input changes redirections
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (view === 'checkout') {
      setView('catalog'); // Instantly redirect back to grid if searching from payment screen
    }
  };

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price <= priceRange;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // 'featured' (original order)
  });

  const activeCategoryInfo = CATEGORIES[activeCategory];
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Background Graphic compositor matching the theme */}
      <BackgroundEffect theme={activeCategory} />

      {/* Header and Search controls */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        triggerCartAnimate={triggerCartAnimate}
      />

      {/* Conditional checkout view vs catalog view */}
      {view === 'checkout' ? (
        <PaymentPage
          cartItems={cartItems}
          onBackToCatalog={() => setView('catalog')}
          onClearCart={() => setCartItems([])}
        />
      ) : (
        /* Main Catalog Viewport */
        <main className="container" style={{ flex: 1 }}>
          
          {/* Dynamic Theme Banner Banner */}
          <section className="hero-banner">
            <img 
              className="hero-banner-image" 
              src={activeCategoryInfo.banner} 
              alt={activeCategoryInfo.name} 
            />
            <div className="hero-banner-overlay" />
            <div className="hero-banner-content">
              <h1>{activeCategoryInfo.name}</h1>
              <p>{activeCategoryInfo.tagline}</p>
            </div>
          </section>

          {/* Category Tabs Selector */}
          <CategorySelector 
            activeCategory={activeCategory} 
            setActiveCategory={(cat) => {
              setActiveCategory(cat);
              // Reset filters and comparisons upon changing category
              setSearchQuery('');
              setCompareList([]);
              // Play theme plucking sounds
              playThemeSound(cat);
            }} 
          />

          {/* Filters and Sorting control panel */}
          <section className="catalog-controls">
            <div className="filter-group">
              <span className="filter-label">Filter Price:</span>
              <div className="price-slider-wrapper">
                <input
                  type="range"
                  className="price-slider"
                  min="10"
                  max="350"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Up to ${priceRange}
                </span>
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Sort By:</span>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </section>

          {/* Product Cards Catalog Grid */}
          <section style={{ position: 'relative' }}>
            <ProductGrid
              products={sortedProducts}
              onAddToCart={handleAddToCart}
              onQuickView={setSelectedProduct}
              resetFilters={resetFilters}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
            />
          </section>

        </main>
      )}

      {/* Floating Sticky Comparison Bar */}
      <div className={`comparison-sticky-bar ${compareList.length > 0 && view === 'catalog' ? 'visible' : ''}`}>
        <div className="comparison-bar-info">
          <span>Compare ({compareList.length}/3)</span>
          <div className="comparison-items-thumbs">
            {compareList.map((item) => (
              <div className="comparison-thumb" key={item.id}>
                <img src={item.image} alt={item.name} />
              </div>
            ))}
          </div>
        </div>
        <div className="comparison-actions">
          <button 
            className="compare-trigger-btn"
            onClick={() => setIsCompareModalOpen(true)}
          >
            Compare Now
          </button>
          <button 
            className="compare-clear-btn"
            onClick={() => setCompareList([])}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Product Comparison Modal Matrix */}
      <ProductCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareList={compareList}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={handleUpdateQuantity}
        removeItem={handleRemoveItem}
        checkout={handleCheckout}
      />

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2026 AURA Collection. Handcrafted using React, custom CSS and vector systems.</p>
          <p className="footer-decor">✦ Elegant Living & Haute Couture ✦</p>
        </div>
      </footer>
    </>
  );
}

export default App;
