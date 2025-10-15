import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Cart.css';

function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      const response = await axios.post(
        'http://localhost:5000/api/orders',
        { items },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess(true);
      clearCart();
      
      // Redirect to bill page after 2 seconds
      setTimeout(() => {
        navigate(`/orders/${response.data.order.id}`);
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Checkout failed');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="cart-container">
        <div className="success-message">
          <h2>✓ Order Placed Successfully!</h2>
          <p>Redirecting to your order details...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button className="btn-primary" onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)} each</p>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  className="btn-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>${(getTotal() * 0.1).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${(getTotal() * 1.1).toFixed(2)}</span>
          </div>
          
          <button 
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => navigate('/shop')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
