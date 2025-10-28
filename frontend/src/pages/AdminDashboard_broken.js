import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import '../styles/AdminDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockUpdateModal, setStockUpdateModal] = useState(false);
  const [newStock, setNewStock] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch dashboard stats
      const [statsRes, ordersRes, productsRes, usersRes, allProductsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/admin/dashboard-stats', { headers }),
        axios.get('http://localhost:3001/api/admin/recent-orders', { headers }),
        axios.get('http://localhost:3001/api/admin/low-stock', { headers }),
        axios.get('http://localhost:3001/api/admin/users', { headers }),
        axios.get('http://localhost:3001/api/inventory', { headers })
      ]);

      setStats(statsRes.data);
      setRecentOrders(ordersRes.data);
      setLowStockProducts(productsRes.data);
      setUsers(usersRes.data);
      setProducts(allProductsRes.data);
      
      // Prepare chart data
      prepareChartData(statsRes.data, allProductsRes.data, ordersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const prepareChartData = (stats, products, orders) => {
    // Revenue chart data (mock monthly data)
    const revenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue ($)',
        data: [12000, 15000, 18000, 22000, 25000, stats.totalRevenue || 30000],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }]
    };

    // Products by category chart
    const categoryData = {};
    products.forEach(product => {
      categoryData[product.category] = (categoryData[product.category] || 0) + 1;
    });

    const categoryChart = {
      labels: Object.keys(categoryData),
      datasets: [{
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ]
      }]
    };

    // Stock levels bar chart
    const stockChart = {
      labels: products.slice(0, 10).map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
      datasets: [{
        label: 'Stock Level',
        data: products.slice(0, 10).map(p => p.stock),
        backgroundColor: products.slice(0, 10).map(p => 
          p.stock <= p.lowStockThreshold ? '#FF6384' : '#36A2EB'
        )
      }]
    };

    setChartData({
      revenue: revenueData,
      categories: categoryChart,
      stock: stockChart
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const updateStock = async (productId, newStockValue) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/inventory/${productId}`, 
        { stock: parseInt(newStockValue) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData(); // Refresh data
      setStockUpdateModal(false);
      setEditingProduct(null);
      alert('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData(); // Refresh data
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status: ' + (error.response?.data?.message || error.message));
    }
  };

  const generateInvoice = (orderId) => {
    window.open(`/invoice/${orderId}`, '_blank');
  };

  const openStockModal = (product) => {
    setEditingProduct(product);
    setNewStock(product.stock.toString());
    setStockUpdateModal(true);
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Comprehensive business management and analytics</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/admin/inventory')} className="inventory-btn">
            📦 Manage Inventory
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
          📦 Orders
        </button>
        <button 
          className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          📋 Stock Alerts
        </button>
        <button 
          className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card revenue">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${stats.totalRevenue || 0}</h3>
                  <p>Total Revenue</p>
                  <span className="stat-trend positive">+12.5%</span>
                </div>
              </div>
              
              <div className="stat-card orders">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalOrders || 0}</h3>
                  <p>Total Orders</p>
                  <span className="stat-trend positive">+8.3%</span>
                </div>
              </div>
              
              <div className="stat-card products">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts || 0}</h3>
                  <p>Products</p>
                  <span className="stat-trend neutral">0%</span>
                </div>
              </div>
              
              <div className="stat-card users">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers || 0}</h3>
                  <p>Users</p>
                  <span className="stat-trend positive">+15.7%</span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
              <div className="chart-card">
                <h3>📈 Revenue Trend</h3>
                {chartData.revenue && (
                  <div className="chart-container">
                    <Line 
                      data={chartData.revenue}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.1)' }
                          },
                          x: {
                            grid: { display: false }
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="chart-card">
                <h3>🍩 Products by Category</h3>
                {chartData.categories && (
                  <div className="chart-container">
                    <Doughnut 
                      data={chartData.categories}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: { padding: 20, usePointStyle: true }
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="chart-card full-width">
                <h3>📊 Current Stock Levels</h3>
                {chartData.stock && (
                  <div className="chart-container">
                    <Bar 
                      data={chartData.stock}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff'
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.1)' }
                          },
                          x: {
                            grid: { display: false }
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="tab-header">
              <h2>📦 Order Management</h2>
              <p>Manage orders, update status, and generate invoices</p>
            </div>
            
            <div className="orders-table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id">#{order.id.toString().padStart(4, '0')}</span>
                      </td>
                      <td>
                        <div className="customer-info">
                          <strong>{order.customerName}</strong>
                          <small>{order.customerEmail}</small>
                        </div>
                      </td>
                      <td>
                        <span className="amount">${parseFloat(order.totalAmount).toFixed(2)}</span>
                      </td>
                      <td>
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`status-select ${order.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn invoice"
                            onClick={() => generateInvoice(order.id)}
                            title="Generate Invoice"
                          >
                            🧾
                          </button>
                          <button 
                            className="action-btn view"
                            onClick={() => navigate(`/admin/order/${order.id}`)}
                            title="View Details"
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="inventory-tab">
            <div className="tab-header">
              <h2>📋 Stock Management</h2>
              <p>Monitor low stock items and update inventory levels</p>
            </div>
            
            <div className="inventory-grid">
              {lowStockProducts.map(product => (
                <div key={product.id} className={`stock-card ${product.stock <= product.lowStockThreshold ? 'critical' : 'warning'}`}>
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div className="placeholder">📦</div>
                    )}
                  </div>
                  
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p className="category">{product.category}</p>
                    <div className="stock-info">
                      <span className="current-stock">Stock: {product.stock}</span>
                      <span className="threshold">Threshold: {product.lowStockThreshold}</span>
                    </div>
                    <div className="price">${parseFloat(product.price).toFixed(2)}</div>
                  </div>
                  
                  <div className="stock-actions">
                    <button 
                      className="update-stock-btn"
                      onClick={() => openStockModal(product)}
                    >
                      📝 Update Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
                  <span className="stat-change positive">+12.5%</span>
                </div>
              </div>
              <div className="stat-card orders">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalOrders || 0}</h3>
                  <p>Total Orders</p>
                  <span className="stat-change positive">+8.3%</span>
                </div>
              </div>
              <div className="stat-card products">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts || 0}</h3>
                  <p>Products</p>
                  <span className="stat-change neutral">0%</span>
                </div>
              </div>
              <div className="stat-card users">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers || 0}</h3>
                  <p>Users</p>
                  <span className="stat-change positive">+15.7%</span>
                </div>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Sales Overview</h3>
                <div className="chart-placeholder">
                  <div className="mock-chart">
                    <div className="chart-bars">
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar" style={{height: '40%'}}></div>
                      <div className="bar" style={{height: '90%'}}></div>
                      <div className="bar" style={{height: '70%'}}></div>
                      <div className="bar" style={{height: '85%'}}></div>
                      <div className="bar" style={{height: '95%'}}></div>
                    </div>
                    <div className="chart-labels">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h3>Top Products</h3>
                <div className="top-products">
                  {stats.topProducts?.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="product-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="name">{product.name}</span>
                      <span className="sales">{product.totalSold} sold</span>
                    </div>
                  )) || <p>No sales data available</p>}
                </div>
              </div>
            </div>

            <div className="alerts-section">
              <h3>System Alerts</h3>
              <div className="alerts-grid">
                {lowStockProducts.length > 0 && (
                  <div className="alert alert-warning">
                    <div className="alert-icon">⚠️</div>
                    <div className="alert-content">
                      <h4>Low Stock Alert</h4>
                      <p>{lowStockProducts.length} products are running low on stock</p>
                    </div>
                  </div>
                )}
                
                <div className="alert alert-info">
                  <div className="alert-icon">📈</div>
                  <div className="alert-content">
                    <h4>Sales Growth</h4>
                    <p>Revenue increased by 12.5% this month</p>
                  </div>
                </div>

                <div className="alert alert-success">
                  <div className="alert-icon">✅</div>
                  <div className="alert-content">
                    <h4>System Status</h4>
                    <p>All systems are operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="orders-header">
              <h2>Recent Orders</h2>
              <p>Manage and track customer orders</p>
            </div>

            <div className="orders-table">
              <div className="table-header">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              {recentOrders.map(order => (
                <div key={order.id} className="table-row">
                  <div className="order-id">#{order.id}</div>
                  <div className="customer-info">
                    <strong>{order.customerName}</strong>
                    <small>{order.customerEmail}</small>
                  </div>
                  <div className="order-date">{formatDate(order.createdAt)}</div>
                  <div className="order-amount">${parseFloat(order.totalAmount).toFixed(2)}</div>
                  <div className="order-status">
                    <select 
                      value={order.status || 'pending'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ backgroundColor: getOrderStatusColor(order.status) }}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="order-actions">
                    <button 
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="view-btn"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="inventory-tab">
            <div className="inventory-header">
              <h2>Stock Alerts</h2>
              <p>Products requiring immediate attention</p>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="no-alerts">
                <div className="no-alerts-icon">✅</div>
                <h3>All Stock Levels Good</h3>
                <p>No products are currently low on stock</p>
              </div>
            ) : (
              <div className="stock-alerts">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="stock-alert-card">
                    <div className="alert-severity">
                      {product.stock === 0 ? (
                        <span className="out-of-stock">OUT OF STOCK</span>
                      ) : (
                        <span className="low-stock">LOW STOCK</span>
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                    </div>
                    <div className="stock-info">
                      <div className="current-stock">
                        <strong>{product.stock}</strong> <span>units left</span>
                      </div>
                      <div className="product-price">${product.price}</div>
                    </div>
                    <div className="alert-actions">
                      <button 
                        onClick={() => navigate('/admin/inventory')}
                        className="restock-btn"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="users-header">
              <h2>User Management</h2>
              <p>Manage customer and admin accounts</p>
            </div>

            <div className="users-stats">
              <div className="user-stat">
                <h4>{users.filter(u => u.role === 'customer').length}</h4>
                <p>Customers</p>
              </div>
              <div className="user-stat">
                <h4>{users.filter(u => u.role === 'admin').length}</h4>
                <p>Admins</p>
              </div>
              <div className="user-stat">
                <h4>{users.length}</h4>
                <p>Total Users</p>
              </div>
            </div>

            <div className="users-table">
              <div className="table-header">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Joined</div>
                <div>Actions</div>
              </div>
              
              {users.map(user => (
                <div key={user.id} className="table-row">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-role">
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="user-date">{formatDate(user.createdAt)}</div>
                  <div className="user-actions">
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="delete-btn"
                      disabled={user.role === 'admin'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;