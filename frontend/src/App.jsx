import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import UserProfile from './pages/UserProfile';
import OrderHistory from './pages/OrderHistory';
import './App.css';

/**
 * Main App Component
 * 
 * ARCHITECTURE DECISIONS:
 * 
 * 1. Context Hierarchy:
 *    - AuthProvider wraps CartProvider because cart needs auth state
 *    - This allows cart to sync with backend API when user is authenticated
 *    - Context API chosen over Redux for simplicity and reduced boilerplate
 * 
 * 2. Error Boundaries:
 *    - Dual-layer error boundaries: one at app root, one around routes
 *    - Prevents entire app crash if a single component fails
 *    - Provides graceful error recovery with user-friendly fallback UI
 * 
 * 3. Protected Routes:
 *    - All main routes wrapped with ProtectedRoute component
 *    - Automatically redirects unauthenticated users to /login
 *    - JWT token validation happens in ProtectedRoute component
 * 
 * 4. Routing Strategy:
 *    - Root path (/) redirects to /products for better UX
 *    - Catch-all route (*) redirects to /products to handle 404s gracefully
 *    - All routes use React Router v6 'element' prop for cleaner syntax
 */
function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        {/* AuthProvider must wrap CartProvider - cart depends on auth state */}
        <AuthProvider>
          {/* CartProvider provides cart state to all child components */}
          <CartProvider>
            <div className="app">
              <Navbar />
              <main className="main-content">
                {/* Second error boundary catches route-level errors */}
                <ErrorBoundary>
                  <Routes>
                    {/* Public route - only accessible when NOT authenticated */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected routes - require authentication */}
                    <Route
                      path="/products"
                      element={
                        <ProtectedRoute>
                          <Products />
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route
                      path="/products/:id"
                      element={
                        <ProtectedRoute>
                          <ProductDetail />
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <UserProfile />
                        </ProtectedRoute>
                      }
                    />
                    
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrderHistory />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Default redirect to products page */}
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    
                    {/* Catch-all for undefined routes */}
                    <Route path="*" element={<Navigate to="/products" replace />} />
                  </Routes>
                </ErrorBoundary>
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

