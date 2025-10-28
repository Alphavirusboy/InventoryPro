import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const navigate = useNavigate();

  const fetchCustomerData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user orders
      const ordersResponse = await axios.get('http://localhost:3001/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(ordersResponse.data);

      // Set user profile
      setUserProfile(user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCustomerData();
  }, [user, navigate, fetchCustomerData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3001/api/auth/profile', userProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const downloadInvoice = async (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name || 'Customer'}!</h1>
          <p>Manage your orders, profile, and shopping experience</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/shop')} className="shop-btn">
            Continue Shopping
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 My Orders
        </button>
        <button 
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{orders.length}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0).toFixed(2)}</h3>
                  <p>Total Spent</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{orders.filter(order => order.status === 'delivered').length}</h3>
                  <p>Delivered Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{orders.filter(order => order.status === 'pending' || order.status === 'processing').length}</h3>
                  <p>Pending Orders</p>
                </div>
              </div>
            </div>

            <div className="recent-orders">
              <h2>Recent Orders</h2>
              {orders.slice(0, 3).map(order => (
                <div key={order.id} className="order-preview">
                  <div className="order-info">
                    <h4>Order #{order.id}</h4>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getOrderStatusColor(order.status) }}
                    >
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <div className="order-total">
                    ${parseFloat(order.total || 0).toFixed(2)}
                  </div>
                </div>
              ))}
              {orders.length > 3 && (
                <button 
                  className="view-all-btn"
                  onClick={() => setActiveTab('orders')}
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="orders-header">
              <h2>Order History</h2>
              <p>Track and manage all your orders</p>
            </div>

            {orders.length === 0 ? (
              <div className="no-orders">
                <div className="no-orders-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Start shopping to see your orders here!</p>
                <button onClick={() => navigate('/shop')} className="start-shopping-btn">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-number">
                        <h3>Order #{order.id}</h3>
                        <p>Placed on {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="order-actions">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getOrderStatusColor(order.status) }}
                        >
                          {order.status || 'pending'}
                        </span>
                        <button 
                          onClick={() => downloadInvoice(order.id)}
                          className="invoice-btn"
                        >
                          📄 View Invoice
                        </button>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.OrderItems && order.OrderItems.map(item => (
                        <div key={item.id} className="order-item">
                          <div className="item-info">
                            <h4>{item.Product?.name || 'Product'}</h4>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                          <div className="item-price">
                            ${parseFloat(item.price || 0).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: ${parseFloat(order.total || 0).toFixed(2)}</strong>
                      </div>
                      <button 
                        onClick={() => navigate(`/order-details/${order.id}`)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="profile-header">
              <h2>Profile Settings</h2>
              <button 
                onClick={() => setEditingProfile(!editingProfile)}
                className="edit-profile-btn"
              >
                {editingProfile ? 'Cancel' : '✏️ Edit Profile'}
              </button>
            </div>

            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={userProfile.name || ''}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userProfile.email || ''}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={userProfile.phone || ''}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={userProfile.address || ''}
                    onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    💾 Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingProfile(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-display">
                <div className="profile-info">
                  <div className="info-group">
                    <label>Name</label>
                    <p>{userProfile.name || 'Not provided'}</p>
                  </div>
                  <div className="info-group">
                    <label>Email</label>
                    <p>{userProfile.email || 'Not provided'}</p>
                  </div>
                  <div className="info-group">
                    <label>Phone</label>
                    <p>{userProfile.phone || 'Not provided'}</p>
                  </div>
                  <div className="info-group">
                    <label>Address</label>
                    <p>{userProfile.address || 'Not provided'}</p>
                  </div>
                  <div className="info-group">
                    <label>Member Since</label>
                    <p>{formatDate(userProfile.createdAt)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;