import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const { getItemCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/shop');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/shop">📦 InventoryPro</Link>
      </div>

      <div className="navbar-menu">
        {/* Customer Links */}
        <Link to="/shop" className="nav-link">🛒 Shop</Link>
        <Link to="/cart" className="nav-link cart-link">
          🛍️ Cart {getItemCount() > 0 && <span className="cart-badge">{getItemCount()}</span>}
        </Link>
        
        {user && <Link to="/my-orders" className="nav-link">📋 My Orders</Link>}
        
        {/* Admin Links - Only show for admin users */}
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard" className="nav-link admin-link">📊 Dashboard</Link>
            <Link to="/admin/inventory" className="nav-link admin-link">📦 Inventory</Link>
            <Link to="/admin/orders" className="nav-link admin-link">📋 All Orders</Link>
            <Link to="/admin/reports" className="nav-link admin-link">📈 Reports</Link>
          </>
        )}
        
        {/* Auth Links */}
        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <span className="user-info">
                👋 {user.name || user.email} {user.role === 'admin' && <span className="admin-badge">Admin</span>}
              </span>
              {user.role === 'customer' && (
                <Link to="/dashboard" className="nav-link dashboard-link">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link login-link">Login</Link>
              <Link to="/signup" className="nav-link signup-link">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
