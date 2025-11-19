import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

/**
 * Navbar Component - Main navigation bar with cart functionality
 * 
 * UI/UX DESIGN DECISIONS:
 * 
 * 1. Conditional Rendering:
 *    - Shows different navigation based on authentication status
 *    - Authenticated: Products, Orders, Profile links + Cart button + Logout
 *    - Not Authenticated: Only Login button
 *    WHY: Prevents access to protected features before login
 * 
 * 2. Active Link Highlighting:
 *    - Uses useLocation() to detect current page
 *    - Adds 'active' class to current page link
 *    WHY: Visual feedback for user's current location in app
 * 
 * 3. Cart Badge:
 *    - Shows total item count (not unique products)
 *    - Only visible when cart has items (cartCount > 0)
 *    WHY: Clean UI when empty, clear count when items present
 * 
 * 4. Auto-open Cart Drawer:
 *    - Listens to shouldOpenCart flag from CartContext
 *    - Automatically opens when item is added
 *    - Resets flag after opening to prevent re-opening
 *    WHY: Immediate visual feedback when adding to cart
 */

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartItemsCount, shouldOpenCart, setShouldOpenCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartCount = getCartItemsCount();

  /**
   * Auto-open cart drawer when item is added
   * Listens to shouldOpenCart flag from CartContext
   * Flag is set to true when addToCart() is called
   */
  useEffect(() => {
    if (shouldOpenCart) {
      setShowCart(true);
      setShouldOpenCart(false); // Reset flag to prevent reopening
    }
  }, [shouldOpenCart, setShouldOpenCart]);

  /**
   * Close mobile menu when route changes
   */
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  /**
   * Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
    navigate('/login');
  };

  const toggleCart = () => {
    setShowCart(!showCart);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🛍️ Marketplace
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links navbar-desktop">
          {isAuthenticated && (
            <>
              <Link
                to="/products"
                className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}
              >
                Products
              </Link>
              
              <Link
                to="/orders"
                className={`navbar-link ${location.pathname === '/orders' ? 'active' : ''}`}
              >
                Orders
              </Link>
              
              <Link
                to="/profile"
                className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                Profile
              </Link>
              
              <button
                onClick={toggleCart}
                className="navbar-cart"
                aria-label="Shopping cart"
              >
                🛒 Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions navbar-desktop">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                Hello, {user?.name || user?.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Actions (Cart + Hamburger) */}
        <div className="navbar-mobile-actions">
          {isAuthenticated && (
            <button
              onClick={toggleCart}
              className="navbar-cart-mobile"
              aria-label="Shopping cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>
          )}
          
          {/* Hamburger Menu Button */}
          {isAuthenticated ? (
            <button
              onClick={toggleMobileMenu}
              className="hamburger-menu"
              aria-label="Toggle menu"
              aria-expanded={showMobileMenu}
            >
              <span className={`hamburger-icon ${showMobileMenu ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary btn-small">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <>
          <div className="mobile-menu-overlay" onClick={toggleMobileMenu}></div>
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <span className="mobile-menu-user">
                Hello, {user?.name || user?.email?.split('@')[0]}! 👋
              </span>
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-close"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            
            <div className="mobile-menu-links">
              <Link
                to="/products"
                className={`mobile-menu-link ${location.pathname === '/products' ? 'active' : ''}`}
              >
                <span className="mobile-menu-icon">📦</span>
                Products
              </Link>
              
              <Link
                to="/orders"
                className={`mobile-menu-link ${location.pathname === '/orders' ? 'active' : ''}`}
              >
                <span className="mobile-menu-icon">📋</span>
                Orders
              </Link>
              
              <Link
                to="/profile"
                className={`mobile-menu-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                <span className="mobile-menu-icon">👤</span>
                Profile
              </Link>
              
              <button
                onClick={toggleCart}
                className="mobile-menu-link mobile-menu-cart"
              >
                <span className="mobile-menu-icon">🛒</span>
                Cart
                {cartCount > 0 && (
                  <span className="cart-badge-mobile">{cartCount}</span>
                )}
              </button>
            </div>
            
            <div className="mobile-menu-footer">
              <button onClick={handleLogout} className="btn btn-outline btn-large">
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}
    </nav>
  );
};

/**
 * CartDrawer Component - Sliding cart panel
 * 
 * UI/UX DESIGN DECISIONS:
 * 
 * 1. Sliding Drawer Pattern:
 *    - Slides in from right side of screen
 *    - Overlay darkens background
 *    - Clicking overlay or X button closes drawer
 *    WHY: Non-intrusive, quick access, doesn't navigate away from current page
 * 
 * 2. Product Images are Clickable:
 *    - Clicking product image/name navigates to product detail page
 *    - Automatically closes drawer on navigation
 *    WHY: Easy way to view more details without manually closing cart
 * 
 * 3. Quantity Controls:
 *    - Plus/minus buttons for adjusting quantity
 *    - Decreasing to 0 removes item automatically
 *    - Shows current quantity between buttons
 *    WHY: Intuitive controls, prevents accidental deletion until 0
 * 
 * 4. Empty Cart State:
 *    - Shows friendly message when cart is empty
 *    - "Continue Shopping" button closes drawer
 *    WHY: Guides user back to shopping flow
 * 
 * 5. Price Display:
 *    - Shows individual item price
 *    - Shows subtotal per line (price × quantity)
 *    - Shows grand total at bottom
 *    WHY: Full transparency of costs before checkout
 */
const CartDrawer = ({ onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  /**
   * Handle checkout button click
   * Currently shows alert - would integrate with checkout flow in production
   */
  const handleCheckout = () => {
    // TODO: Integrate with real checkout flow
    alert('Checkout functionality would go here!');
    onClose();
  };

  /**
   * Navigate to product detail page
   * Allows users to view full product info from cart
   */
  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
    onClose(); // Close cart drawer after navigation
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose}></div>
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button onClick={onClose} className="close-button" aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <button onClick={onClose} className="btn btn-primary">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => {
                  const productId = item.product._id || item.product.id;
                  return (
                  <div key={productId} className="cart-item">
                    <img
                      src={item.product.image || 'https://via.placeholder.com/80'}
                      alt={item.product.name}
                      className="cart-item-image"
                      onClick={() => handleViewProduct(productId)}
                    />
                    
                    <div className="cart-item-details">
                      <h4 
                        className="cart-item-name"
                        onClick={() => handleViewProduct(productId)}
                      >
                        {item.product.name}
                      </h4>
                      <p className="cart-item-price">
                        ${item.product.price.toFixed(2)}
                      </p>
                      
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(productId, item.quantity - 1)}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(productId, item.quantity + 1)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(productId)}
                          className="remove-btn"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <button onClick={handleCheckout} className="btn btn-primary btn-large">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

