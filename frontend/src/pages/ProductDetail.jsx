import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getById(id);
        
        if (response.success) {
          setProduct(response.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setSuccessMessage('');
    
    const result = await addToCart(product, quantity);
    
    if (result.success) {
      setSuccessMessage(`Added ${quantity} item(s) to cart!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    
    setAddingToCart(false);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="product-detail">
        <div className="product-image-section">
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="product-image-large"
          />
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <span className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="product-description">
            {product.description || 'No description available.'}
          </p>

          {product.category && (
            <div className="product-category">
              <strong>Category:</strong> {product.category.name}
            </div>
          )}

          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {inStock && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn btn-primary btn-large"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {!inStock && (
            <div className="out-of-stock-message">
              <p>This product is currently out of stock.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

