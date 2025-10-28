import React, { useState, useMemo } from 'react';
import '../styles/ProductFilters.css';

const ProductFilters = ({ products, onFilteredProducts, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Get price range from products
  const priceStats = useMemo(() => {
    if (!products.length) return { min: 0, max: 100 };
    const prices = products.map(p => parseFloat(p.price));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search term filter
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        product.category === selectedCategory;

      // Price range filter
      const price = parseFloat(product.price);
      const matchesPriceMin = !priceRange.min || price >= parseFloat(priceRange.min);
      const matchesPriceMax = !priceRange.max || price <= parseFloat(priceRange.max);

      // Stock filter
      const matchesStock = stockFilter === 'all' ||
        (stockFilter === 'in-stock' && product.stock > 0) ||
        (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
        (stockFilter === 'out-of-stock' && product.stock === 0);

      return matchesSearch && matchesCategory && matchesPriceMin && matchesPriceMax && matchesStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, priceRange, stockFilter, sortBy, sortOrder]);

  // Update parent component when filters change
  React.useEffect(() => {
    onFilteredProducts(filteredProducts);
  }, [filteredProducts, onFilteredProducts]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setStockFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || 
    priceRange.min || priceRange.max || stockFilter !== 'all';

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>🔍 Search & Filter Products</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            ✖ Clear All Filters
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Search */}
        <div className="filter-group">
          <label>Search Products</label>
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        {/* Category */}
        <div className="filter-group">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-range">
            <input
              type="number"
              placeholder={`Min ($${priceStats.min})`}
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              className="price-input"
              min={priceStats.min}
              max={priceStats.max}
            />
            <span className="price-separator">to</span>
            <input
              type="number"
              placeholder={`Max ($${priceStats.max})`}
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              className="price-input"
              min={priceStats.min}
              max={priceStats.max}
            />
          </div>
        </div>

        {/* Stock Status */}
        <div className="filter-group">
          <label>Stock Status</label>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Products</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock (≤10)</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label>Sort By</label>
          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="sort-order-btn"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? '📈' : '📉'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span className="results-count">
          Showing {filteredProducts.length} of {products.length} products
        </span>
        
        {hasActiveFilters && (
          <div className="active-filters">
            {searchTerm && (
              <span className="filter-tag">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="filter-tag">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>×</button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="filter-tag">
                Price: ${priceRange.min || priceStats.min} - ${priceRange.max || priceStats.max}
                <button onClick={() => setPriceRange({ min: '', max: '' })}>×</button>
              </span>
            )}
            {stockFilter !== 'all' && (
              <span className="filter-tag">
                Stock: {stockFilter.replace('-', ' ')}
                <button onClick={() => setStockFilter('all')}>×</button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;