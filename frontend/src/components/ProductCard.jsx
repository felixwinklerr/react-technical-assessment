import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

/**
 * ProductCard Component - Reusable product display card
 * 
 * COMPONENT DESIGN:
 * 
 * 1. Wrapped in Link:
 *    - Entire card is clickable and navigates to product detail page
 *    - Provides intuitive navigation without explicit "View Details" button
 *    WHY: Follows common e-commerce pattern, improves UX
 * 
 * 2. Quick Add Button:
 *    - Allows adding to cart without leaving product list
 *    - Uses e.stopPropagation() to prevent card navigation
 *    - Shows temporary "✓ Added" feedback for 1 second
 *    WHY: Faster shopping experience, visual confirmation
 * 
 * 3. Stock Indicators:
 *    - Out of stock overlay on product image
 *    - Disabled "Add" button when out of stock
 *    - Shows "Out of Stock" text instead of button
 *    WHY: Clear visual feedback prevents frustration
 * 
 * 4. Image Lazy Loading:
 *    - Uses loading="lazy" attribute
 *    - Improves initial page load performance
 *    WHY: Better performance with many products
 * 
 * 5. Truncated Descriptions:
 *    - Limits description to 80 characters with "..."
 *    - Prevents cards from having different heights
 *    WHY: Maintains consistent grid layout
 */

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Quick add handler - adds product without navigation
   * Prevents event bubbling to avoid triggering Link navigation
   */
  const handleQuickAdd = async (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent card click/navigation
    
    setAdding(true);
    await addToCart(product, 1);
    // Show "Added" feedback for 1 second
    setTimeout(() => setAdding(false), 1000);
  };

  /**
   * Handle image loading errors
   * Falls back to placehold.co if image fails to load
   */
  const handleImageError = (e) => {
    if (!imageError) {
      setImageError(true);
      e.target.src = `https://placehold.co/800x600/3b82f6/white?text=${encodeURIComponent(product.name)}`;
    }
  };

  const inStock = product.stock > 0;

  return (
    <Link to={`/products/${product._id || product.id}`} className="product-card">
      <div className="product-card-image">
        <img
          src={product.image || `https://placehold.co/800x600/3b82f6/white?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
        />
        {!inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        
        <p className="product-card-description">
          {product.description?.substring(0, 80)}
          {product.description?.length > 80 && '...'}
        </p>

        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          
          {inStock ? (
            <button
              onClick={handleQuickAdd}
              disabled={adding}
              className="btn btn-secondary btn-small"
            >
              {adding ? '✓ Added' : '+ Add'}
            </button>
          ) : (
            <span className="out-of-stock-text">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

