import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

/**
 * Cart Context - Shopping Cart State Management
 * 
 * DESIGN DECISIONS:
 * 
 * 1. Hybrid Storage Strategy (localStorage + Backend API):
 *    WHY: Provides best of both worlds
 *    - localStorage: Instant cart persistence, works offline, survives page refresh
 *    - Backend API: Syncs cart across devices when authenticated
 *    - On login, backend cart overwrites localStorage (server is source of truth)
 *    - While browsing anonymously, cart stays in localStorage only
 * 
 * 2. Product ID Flexibility (_id vs id):
 *    WHY: Backend uses 'id' but MongoDB convention is '_id'
 *    - Check both fields to handle data from different sources
 *    - Ensures compatibility with mock data and real database
 * 
 * 3. Optimistic UI Updates:
 *    WHY: Better user experience
 *    - Update local state immediately (feels instant)
 *    - Sync with API in background
 *    - If API fails, still have local state (graceful degradation)
 * 
 * 4. Auto-open Cart Feature:
 *    WHY: Provide immediate visual feedback when adding items
 *    - Sets shouldOpenCart flag when item added
 *    - Navbar listens to this flag and opens cart drawer
 *    - Flag is reset after cart opens (prevents reopening)
 */

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shouldOpenCart, setShouldOpenCart] = useState(false); // Flag for auto-opening cart
  const { isAuthenticated } = useAuth();

  /**
   * Effect 1: Load cart from localStorage on component mount
   * This ensures cart persists across page refreshes
   */
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  /**
   * Effect 2: Sync cart to localStorage whenever it changes
   * Provides automatic persistence without manual saves
   */
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Effect 3: Fetch cart from backend API when user authenticates
   * Backend cart is the source of truth for authenticated users
   * This overwrites localStorage with server data
   */
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const response = await cartAPI.getCart();
          if (response.success) {
            // Replace local cart with server cart on login
            setCartItems(response.data.items || []);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          // Keep local cart if API fails (graceful degradation)
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [isAuthenticated]);

  /**
   * Add item to cart (or increment quantity if already exists)
   * 
   * @param {Object} product - Product object to add
   * @param {Number} quantity - Quantity to add (default: 1)
   * @returns {Object} Success status and optional error message
   * 
   * LOGIC:
   * 1. Check if product already in cart
   * 2. If yes: increment quantity
   * 3. If no: add as new item
   * 4. Update local state immediately (optimistic UI)
   * 5. Sync with backend if authenticated (background)
   * 6. Trigger cart drawer to open (visual feedback)
   */
  const addToCart = async (product, quantity = 1) => {
    try {
      // Get product ID (support both _id and id for flexibility)
      const productId = product._id || product.id;
      
      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(
        (item) => (item.product._id || item.product.id) === productId
      );

      let newCartItems;
      if (existingItemIndex > -1) {
        // Product exists: increment quantity
        newCartItems = [...cartItems];
        newCartItems[existingItemIndex].quantity += quantity;
      } else {
        // Product doesn't exist: add new item
        newCartItems = [...cartItems, { product, quantity }];
      }

      // Optimistic update: set state immediately for instant UI feedback
      setCartItems(newCartItems);

      // Background sync with API if user is authenticated
      if (isAuthenticated) {
        await cartAPI.addToCart(productId, quantity);
      }

      // Trigger cart drawer to open for visual confirmation
      setShouldOpenCart(true);

      return { success: true };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, error: 'Failed to add item to cart' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      const newCartItems = cartItems.map((item) =>
        (item.product._id || item.product.id) === productId ? { ...item, quantity } : item
      );

      setCartItems(newCartItems);

      // Sync with API if authenticated
      if (isAuthenticated) {
        await cartAPI.updateCartItem(productId, quantity);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to update cart:', error);
      return { success: false, error: 'Failed to update cart' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const newCartItems = cartItems.filter(
        (item) => (item.product._id || item.product.id) !== productId
      );

      setCartItems(newCartItems);

      // Sync with API if authenticated
      if (isAuthenticated) {
        await cartAPI.removeFromCart(productId);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return { success: false, error: 'Failed to remove item from cart' };
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    shouldOpenCart,
    setShouldOpenCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

