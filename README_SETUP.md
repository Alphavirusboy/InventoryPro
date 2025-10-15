# Inventory Management System - Setup Guide

## 🎯 Project Overview

A comprehensive inventory management system with:
- **Customer Portal**: Browse products, add to cart, place orders, view bills
- **Admin Dashboard**: Manage inventory, view analytics with graphs, handle missing product reports
- **Authentication**: Separate login/signup for customers and admins
- **Automated Features**: Bill generation, stock tracking, missing product reports

## 🏗️ System Architecture

### Backend (Node.js + Express + MySQL)
- RESTful API with JWT authentication
- Models: User, Product, Order, OrderItem, MissingProductReport
- Protected routes for admin and customer roles
- Analytics endpoints for dashboard graphs

### Frontend (React)
- Modern UI with gradient designs
- React Router for navigation
- Context API for state management (Auth, Cart)
- Recharts for analytics visualization
- Role-based access control

## 📋 Prerequisites

1. **Node.js** (v14 or higher) ✅ Installed
2. **MySQL Server** ❌ Not installed - **REQUIRED**
3. **npm** ✅ Installed

## 🚀 Installation Steps

### 1. Install MySQL

**On macOS:**
```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Secure installation
mysql_secure_installation
```

**On Windows:**
Download and install from: https://dev.mysql.com/downloads/mysql/

**On Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE inventory_db;
EXIT;
```

### 3. Configure Environment

Update `/inventory-backend/.env`:
```env
DB_NAME=inventory_db
DB_USER=root
DB_PASS=your_mysql_password_here
DB_HOST=localhost
PORT=5000
JWT_SECRET=supersecretkey
```

### 4. Install Dependencies

Already completed! ✅

```bash
# Backend
cd inventory-backend
npm install

# Frontend
cd frontend
npm install
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd /Users/parthpatil/Downloads/SEmini/inventory-backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd /Users/parthpatil/Downloads/SEmini/frontend
npm start
```

## 🎨 Features Implemented

### ✅ Customer Features
- 🔐 Signup/Login with role selection
- 🛒 Browse products with search and category filter
- 🛍️ Add to cart functionality
- 💳 Checkout process with stock validation
- 📄 Automated bill generation
- 📦 View order history
- 🔔 Missing product reporting (automatic)

### ✅ Admin Features
- 🔐 Admin-only authentication
- 📊 Analytics dashboard with:
  - Sales trend graphs (line chart)
  - Top products (bar chart)
  - Revenue statistics
  - Low stock alerts
- 📦 Inventory management:
  - Add/edit/delete products
  - Real-time stock updates
  - Category management
- 📋 Missing product reports:
  - View customer requests
  - Mark as restocked/dismissed
  - Request count tracking
- 📑 View all orders and bills

### 🎯 Security Features
- JWT-based authentication
- Role-based access control
- Protected routes (customer cannot access admin)
- Password hashing with bcrypt
- Token expiration

### 💅 UI/UX Features
- Modern gradient design
- Responsive layout
- Smooth animations and transitions
- Real-time cart updates
- Loading states
- Error handling
- Print-friendly bills

## 📱 Pages Structure

```
/                   → Home/Landing page
/signup             → User registration
/login              → User authentication

Customer Routes (Protected):
/shop               → Product catalog
/cart               → Shopping cart
/my-orders          → Order history
/orders/:id         → Bill details

Admin Routes (Admin only):
/admin/dashboard    → Analytics & graphs
/admin/inventory    → Manage products
/admin/reports      → Missing products
/admin/orders       → All customer orders
```

## 🗄️ Database Schema

### Users
- id, name, email, password (hashed), role (admin/customer)

### Products
- id, name, description, category, price, stock, lowStockThreshold, imageUrl

### Orders
- id, userId, totalAmount, status, customerName, customerEmail

### OrderItems
- id, orderId, productId, productName, quantity, price, subtotal

### MissingProductReports
- id, productName, requestedQuantity, customerId, customerName, status, requestCount

## 🎯 API Endpoints

### Authentication
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Sign in

### Products (Public)
- GET `/api/inventory` - List all products (with search/filter)
- GET `/api/inventory/:id` - Get product details

### Orders (Protected)
- POST `/api/orders` - Place order (generates bill)
- GET `/api/orders/my-orders` - User's orders
- GET `/api/orders/:id` - Order details

### Admin (Admin only)
- GET `/api/admin/analytics/dashboard` - Dashboard data
- GET `/api/admin/orders` - All orders
- GET `/api/admin/missing-products` - Reports
- PATCH `/api/admin/missing-products/:id` - Update report
- POST `/api/inventory` - Add product
- PUT `/api/inventory/:id` - Update product
- PATCH `/api/admin/products/:id/stock` - Update stock
- DELETE `/api/admin/products/:id` - Delete product

## 🔧 Technologies Used

### Backend
- Express.js
- Sequelize ORM
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

### Frontend
- React 19
- React Router DOM
- Axios
- Recharts (for graphs)
- Context API
- CSS3 (Modern gradients & animations)

## 📊 Sample Data

To test the system, you can:

1. **Create Admin Account:**
   - Signup with role: "Admin"
   - Email: admin@test.com
   - Password: admin123

2. **Create Customer Account:**
   - Signup with role: "Customer"
   - Email: customer@test.com
   - Password: customer123

3. **Add Sample Products (as Admin):**
   - Go to Admin → Inventory → Add Product

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running: `brew services list`
- Check database credentials in `.env`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Frontend errors
- Clear cache: `rm -rf node_modules package-lock.json && npm install`
- Check if backend is running on port 5000

### Can't login
- Check browser console for errors
- Verify JWT token in localStorage
- Ensure backend API is accessible

## 🎨 Color Scheme

- Primary: #667eea (Purple Blue)
- Secondary: #764ba2 (Deep Purple)
- Success: #27ae60 (Green)
- Danger: #e74c3c (Red)
- Warning: #ffc107 (Yellow)

## 📝 Next Steps

1. Install and configure MySQL
2. Update database credentials
3. Start backend and frontend
4. Create admin account
5. Add products
6. Test customer flow

## 🚀 Production Deployment

For production, consider:
- Using environment variables for sensitive data
- Setting up HTTPS
- Implementing rate limiting
- Adding input validation
- Setting up proper logging
- Using a process manager (PM2)
- Database backups
- CDN for frontend assets

---

Created with ❤️ by GitHub Copilot
