import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">📦 InventoryPro</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-btn">Sign Up</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">📦 InventoryPro</Link>
      </div>

      <div className="navbar-menu">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/inventory" className="nav-link">Inventory</Link>
            <Link to="/admin/reports" className="nav-link">Reports</Link>
            <Link to="/admin/orders" className="nav-link">All Orders</Link>
          </>
        ) : (
          <>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/my-orders" className="nav-link">My Orders</Link>
            <Link to="/cart" className="nav-link cart-link">
              🛒 Cart {getItemCount() > 0 && <span className="cart-badge">{getItemCount()}</span>}
            </Link>
          </>
        )}
        
        <div className="user-menu">
          <span className="user-name">{user.email}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
