import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Orders.css';

function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id, token]); // Added token as dependency

  const fetchOrder = async () => {
    try {
      setLoading(true);
      console.log('Fetching order ID:', id);
      
      // Always try to fetch the order, with token if available
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.get(
        `http://localhost:3001/api/orders/${id}`,
        { headers }
      );
      
      console.log('Order fetched successfully:', response.data);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      console.error('Error response:', error.response?.data);
      
      // If it's a 404, show order not found
      if (error.response?.status === 404) {
        setOrder(null);
      } else {
        // For other errors, still try to show what we can
        setOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const printBill = () => {
    window.print();
  };

  if (loading) return <div className="loading">Loading order...</div>;
  if (!order) return <div className="error">Order not found</div>;

  return (
    <div className="order-details-container">
      <div className="bill-header">
        <h1>Order Bill</h1>
        <button onClick={printBill} className="btn-print">🖨️ Print Bill</button>
      </div>

      <div className="bill-container">
        <div className="bill-info">
          <div className="bill-row">
            <strong>Order ID:</strong>
            <span>#{order.order.id}</span>
          </div>
          <div className="bill-row">
            <strong>Date:</strong>
            <span>{new Date(order.order.createdAt).toLocaleString()}</span>
          </div>
          <div className="bill-row">
            <strong>Customer:</strong>
            <span>{order.order.customerName}</span>
          </div>
          <div className="bill-row">
            <strong>Status:</strong>
            <span className={`status ${order.order.status}`}>
              {order.order.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="bill-items">
          <h2>Items</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bill-total">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>${order.order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Tax (10%):</span>
            <span>${(order.order.totalAmount * 0.1).toFixed(2)}</span>
          </div>
          <div className="total-row grand-total">
            <span>Total Amount:</span>
            <span>${(order.order.totalAmount * 1.1).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
