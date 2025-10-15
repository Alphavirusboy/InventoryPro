import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const response = await axios.get('http://localhost:5000/api/inventory', { params });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inventory/categories/list');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
      // Show feedback
      const btn = document.getElementById(`add-btn-${product.id}`);
      if (btn) {
        btn.textContent = '✓ Added';
        btn.classList.add('added');
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.classList.remove('added');
        }, 1500);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Shop Products</h1>
        <div className="header-actions">
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            🛒 Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </div>
      </div>

      <div className="shop-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <button
            className={selectedCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">No products found</div>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <div className="placeholder-image">📦</div>
                )}
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <div className="product-price">${product.price.toFixed(2)}</div>
                  <div className={`product-stock ${product.stock <= product.lowStockThreshold ? 'low' : ''}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                  </div>
                </div>
                <button
                  id={`add-btn-${product.id}`}
                  className="btn-add-cart"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Shop;
