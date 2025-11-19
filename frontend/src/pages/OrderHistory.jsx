import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/orders');
        
        if (response.data.success) {
          setOrders(response.data.data || []);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        // If API fails, show demo orders
        setOrders(getDemoOrders());
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Demo orders for when API is unavailable
  const getDemoOrders = () => [
    {
      id: 'order-1',
      orderNumber: 'ORD-2025-001',
      createdAt: '2025-01-15T10:30:00Z',
      status: 'delivered',
      total: 1119.98,
      items: [
        { name: 'iPhone 15 Pro', quantity: 1, price: 999.99 },
        { name: 'Nike Air Max 90', quantity: 1, price: 119.99 }
      ]
    },
    {
      id: 'order-2',
      orderNumber: 'ORD-2025-002',
      createdAt: '2025-02-01T14:20:00Z',
      status: 'shipped',
      total: 2499.99,
      items: [
        { name: 'MacBook Pro 16"', quantity: 1, price: 2499.99 }
      ]
    },
    {
      id: 'order-3',
      orderNumber: 'ORD-2025-003',
      createdAt: '2025-02-10T09:15:00Z',
      status: 'processing',
      total: 1212.98,
      items: [
        { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 1199.99 },
        { name: 'The Great Gatsby', quantity: 1, price: 12.99 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      processing: '📦',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-container">
          <h2>Unable to Load Orders</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Order History</h1>
        <p className="subtitle">Track and manage your orders</p>

        <div className="order-filters">
          <button 
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All ({orders.length})
          </button>
          <button 
            onClick={() => setFilter('processing')}
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
          >
            Processing
          </button>
          <button 
            onClick={() => setFilter('shipped')}
            className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
          >
            Shipped
          </button>
          <button 
            onClick={() => setFilter('delivered')}
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
          >
            Delivered
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusIcon(order.status)} {order.status.toUpperCase()}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-details">
                      <span className="order-item-name">{item.name}</span>
                      <span className="order-item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <span className="order-item-price">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total:</strong> ${order.total.toFixed(2)}
                </div>
                <div className="order-actions">
                  <button className="btn btn-outline btn-small">
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="btn btn-secondary btn-small">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

