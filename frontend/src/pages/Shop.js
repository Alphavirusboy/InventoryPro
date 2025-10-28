import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const { addToCart, cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const response = await axios.get('http://localhost:3001/api/inventory', { params });
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/inventory/categories/list');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchProducts();
      await fetchCategories();
    };
    loadData();
  }, [selectedCategory, searchTerm, fetchProducts]);

  const handleAddToCart = async (product, quantity = null) => {
    const selectedQuantity = quantity || quantities[product.id] || 1;
    if (product.stock > 0 && selectedQuantity <= product.stock) {
      const result = await addToCart(product, selectedQuantity);
      
      // Show feedback
      const btn = document.getElementById(`add-btn-${product.id}`);
      if (btn) {
        if (result.success) {
          btn.textContent = `✓ Added ${selectedQuantity}`;
          btn.classList.add('added');
          // Refresh products to get updated stock
          fetchProducts();
          setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.classList.remove('added');
          }, 1500);
        } else {
          btn.textContent = result.message || 'Error';
          btn.classList.add('error');
          setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.classList.remove('error');
          }, 2000);
        }
      }
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const maxQuantity = products.find(p => p.id === productId)?.stock || 1;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(newQuantity, maxQuantity))
    }));
  };

  const getQuantity = (productId) => {
    return quantities[productId] || 1;
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock':
        return b.stock - a.stock;
      default:
        return 0;
    }
  });

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return { status: 'out', label: 'Out of Stock', color: '#e74c3c' };
    if (stock <= threshold) return { status: 'low', label: 'Low Stock', color: '#f39c12' };
    return { status: 'good', label: 'In Stock', color: '#27ae60' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <div className="header-content">
          <h1>🛒 Shop Products</h1>
          <p>Discover amazing products at great prices</p>
        </div>
        
        <div className="header-actions">
          {user && (
            <div className="welcome-msg">
              Welcome back, {user.name || user.email}! 👋
            </div>
          )}
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            🛍️ Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </div>
      </div>

      <div className="shop-controls">
        <div className="search-filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-section">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-filter"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock Level</option>
            </select>
          </div>
        </div>
      </div>

      <div className="products-section">
        {sortedProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {sortedProducts.map(product => {
              const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
              const quantity = getQuantity(product.id);
              
              return (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }} />
                    ) : null}
                    <div className="placeholder-image" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
                      📦
                    </div>
                    <div 
                      className={`stock-badge ${stockStatus.status}`}
                      style={{ backgroundColor: stockStatus.color }}
                    >
                      {stockStatus.label}
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">
                      {product.description?.length > 100 
                        ? product.description.substring(0, 100) + '...' 
                        : product.description}
                    </p>
                    <div className="product-category">{product.category}</div>
                    
                    <div className="product-details">
                      <span className="product-price">{product.price.toFixed(2)}</span>
                      <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock} in stock
                      </span>
                    </div>
                    
                    {product.stock > 0 ? (
                      <div className="product-actions">
                        <div className="quantity-selector">
                          <button 
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            -
                          </button>
                          <span>{quantity}</span>
                          <button 
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          id={`add-btn-${product.id}`}
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    ) : (
                      <button className="out-of-stock-btn" disabled>
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;