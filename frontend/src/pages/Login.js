import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/shop');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Demo credentials quick login
  const quickLogin = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@inventorypro.com',
        password: 'admin123',
        role: 'admin'
      });
    } else {
      setFormData({
        email: 'customer@inventorypro.com',
        password: 'customer123',
        role: 'customer'
      });
    }
  };

  return (
    <div className="modern-auth-container">
      {/* Left Side - Branding */}
      <div className="auth-branding">
        <div className="branding-content">
          <div className="logo-section">
            <div className="logo-icon">📦</div>
            <h1 className="brand-name">InventoryPro</h1>
          </div>
          <h2 className="brand-tagline">Professional Inventory Management</h2>
          <p className="brand-description">
            Streamline your business operations with our comprehensive inventory management system. 
            Track stock, manage orders, and analyze your business performance all in one place.
          </p>
          <div className="feature-highlights">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Real-time Analytics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure & Reliable</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Welcome Back!</h2>
            <p>Please sign in to your account</p>
          </div>

          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="modern-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="modern-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="role">Account Type</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="modern-select"
                >
                  <option value="customer">Customer Account</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="modern-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or try demo accounts</span>
          </div>

          <div className="demo-accounts">
            <button 
              onClick={() => quickLogin('admin')} 
              className="demo-btn admin-demo"
            >
              <div className="demo-btn-content">
                <span className="demo-icon">👨‍💼</span>
                <div>
                  <div className="demo-title">Admin Demo</div>
                  <div className="demo-subtitle">Full access dashboard</div>
                </div>
              </div>
            </button>
            <button 
              onClick={() => quickLogin('customer')} 
              className="demo-btn customer-demo"
            >
              <div className="demo-btn-content">
                <span className="demo-icon">🛍️</span>
                <div>
                  <div className="demo-title">Customer Demo</div>
                  <div className="demo-subtitle">Shopping experience</div>
                </div>
              </div>
            </button>
          </div>

          <div className="form-footer">
            <p>
              Don't have an account? 
              <Link to="/signup" className="footer-link"> Create one here</Link>
            </p>
            <p>
              <Link to="/shop" className="footer-link">Continue as Guest</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;