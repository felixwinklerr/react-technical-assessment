import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

/**
 * Products Page - Main product listing with advanced filtering
 * 
 * FILTERING STRATEGY:
 * 
 * 1. Client-Side Filtering:
 *    WHY: Instant response, no API calls for each filter change
 *    - Fetch all products once
 *    - Apply filters in browser using JavaScript
 *    - Allows combining multiple filters (search + category + price)
 * 
 * 2. Filter Combination Logic:
 *    - All filters use AND logic (must satisfy all conditions)
 *    - Search: Checks both name AND description (OR within search)
 *    - Category: Exact match filter
 *    - Price: Range filter with optional min/max
 *    - Sort: Applied after filtering
 * 
 * 3. Search Implementation:
 *    WHY: Case-insensitive substring matching
 *    - Searches in product name and description
 *    - Uses toLowerCase() for case-insensitive comparison
 *    - Immediate feedback as user types
 * 
 * 4. Performance Consideration:
 *    - Filters run on every render (computed on-the-fly)
 *    - Fine for small datasets (< 1000 products)
 *    - For larger datasets, consider useMemo() or server-side filtering
 */

const Products = () => {
  // State for products data and UI states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states - each filter is independent and combinable
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('');
  
  // Mobile filter toggle
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsAPI.getAll();
        
        if (response.success) {
          setProducts(response.data.products || []);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /**
   * STEP 1: Extract unique categories from products
   * - Starts with 'all' option for showing all products
   * - Uses Set to get unique category names
   * - filter(Boolean) removes undefined/null categories
   */
  const categories = ['all', ...new Set(products.map(p => p.category?.name).filter(Boolean))];

  /**
   * STEP 2: Apply all filters (AND logic - must pass all conditions)
   * 
   * Filter Conditions:
   * 1. Search: Name OR Description contains search query (case-insensitive)
   * 2. Category: Matches selected category (or 'all' for no filter)
   * 3. Price Min: Product price >= min price (or no min set)
   * 4. Price Max: Product price <= max price (or no max set)
   * 
   * All conditions must be true for product to appear in results
   */
  let filteredProducts = products.filter((product) => {
    // Search filter: check both name and description
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter: 'all' bypasses filter, otherwise must match exactly
    const matchesCategory = selectedCategory === 'all' || 
      product.category?.name === selectedCategory;
    
    // Price range filters: empty string means no limit
    const matchesPriceMin = !priceRange.min || product.price >= parseFloat(priceRange.min);
    const matchesPriceMax = !priceRange.max || product.price <= parseFloat(priceRange.max);
    
    // Return true only if ALL conditions are met (AND logic)
    return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax;
  });

  /**
   * STEP 3: Sort filtered products (applied after filtering)
   * 
   * Sort Options:
   * - price_asc: Low to high (ascending price)
   * - price_desc: High to low (descending price)
   * - name: Alphabetical A-Z (localeCompare for proper string sorting)
   * - default: No sorting (products remain in original API order)
   * 
   * Note: Creating new array [...filteredProducts] to avoid mutating state
   */
  if (sortBy === 'price_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('');
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Our Products</h1>
        <p className="subtitle">Discover amazing products at great prices</p>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Toggle Button (Mobile Only) */}
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <span className="filter-icon">🔍</span>
          Filters {showFilters ? '▲' : '▼'}
          {(selectedCategory !== 'all' || priceRange.min || priceRange.max || sortBy) && (
            <span className="filter-active-badge">•</span>
          )}
        </button>

        <div className={`filters-bar ${showFilters ? 'filters-visible' : ''}`}>
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          <div className="filter-group price-filter">
            <label>Price Range:</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="price-input"
              />
            </div>
          </div>

          <button onClick={clearFilters} className="btn btn-outline btn-small">
            Clear Filters
          </button>
        </div>

        <div className="results-count">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found{searchQuery && ` matching "${searchQuery}"`}</p>
          <button onClick={clearFilters} className="btn btn-primary">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

