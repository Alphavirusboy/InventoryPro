import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/shop');
      }
    }
  }, [user, navigate]);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">InventoryPro</span>
          </h1>
          <p className="hero-subtitle">
            Modern Inventory Management System
          </p>
          <p className="hero-description">
            Manage your products, track orders, and analyze customer behavior with our comprehensive inventory solution.
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn-hero-primary"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>

        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🛒</div>
            <h3>Easy Shopping</h3>
            <p>Browse products and place orders effortlessly</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track sales and customer behavior with interactive charts</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Inventory Management</h3>
            <p>Manage stock levels and receive low-stock alerts</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Automated Billing</h3>
            <p>Generate and store bills automatically</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
