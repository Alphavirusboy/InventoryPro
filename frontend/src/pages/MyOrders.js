import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Orders.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/orders/my-orders',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-total">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.map(item => (
                  <div key={item.id} className="order-item-preview">
                    <span>{item.productName}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                <span className={`status ${order.status}`}>
                  {order.status}
                </span>
                <button 
                  className="btn-view"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  View Bill
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
