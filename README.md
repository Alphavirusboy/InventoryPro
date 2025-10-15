# 🏪 InventoryPro - Inventory Management System

A comprehensive full-stack inventory management system with separate portals for customers and administrators. Built with React, Node.js, Express, and MySQL.

## ✨ Features

### 👤 Customer Features
- **User Authentication**: Secure signup and login
- **Product Browsing**: View all available products with real-time stock information
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Placement**: Place orders and receive bills automatically
- **Order History**: View past orders and track order details
- **Bill Generation**: Automatic bill creation with order details

### 👨‍💼 Admin Features
- **Dashboard Analytics**: Visual charts and graphs for business insights
  - Total revenue tracking
  - Order statistics
  - Product inventory overview
- **Inventory Management**: 
  - Add, edit, and delete products
  - Track stock levels in real-time
  - Low stock alerts
- **Order Management**: View and manage customer orders
- **Missing Product Reports**: Track and manage customer requests for out-of-stock items
- **Analytics & Reports**: Data visualization using Recharts

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Context API** - State management (Auth & Cart)
- **CSS3** - Styling with gradients and modern design

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MySQL Server** (v5.7 or higher)

### Installing MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Windows:**
Download from [MySQL Official Website](https://dev.mysql.com/downloads/mysql/)

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Alphavirusboy/InventoryPro.git
cd InventoryPro
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd inventory-backend

# Install dependencies
npm install

# Create .env file (if not exists)
# Update the following variables in .env file:
DB_NAME=inventory_db
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
PORT=5000
JWT_SECRET=supersecretkey
```

### 3. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE inventory_db;

# Exit MySQL
exit;
```

The database tables will be created automatically when you start the server (thanks to Sequelize sync).

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

## 🎮 Running the Application

### Start Backend Server

```bash
# From inventory-backend directory
cd inventory-backend
node server.js
```

The backend will run on `http://localhost:5000`

### Start Frontend Server

```bash
# From frontend directory (open a new terminal)
cd frontend
npm start
```

The frontend will automatically open at `http://localhost:3000`

## 📁 Project Structure

```
InventoryPro/
├── frontend/                  # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/          # Context providers
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/            # Page components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Shop.js
│   │   │   ├── Cart.js
│   │   │   ├── MyOrders.js
│   │   │   ├── OrderDetails.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminInventory.js
│   │   │   ├── AdminOrders.js
│   │   │   └── AdminReports.js
│   │   ├── styles/           # CSS files
│   │   ├── api.js            # API configuration
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── inventory-backend/         # Node.js backend
    ├── middleware/           # Custom middleware
    │   └── auth.js          # JWT authentication
    ├── models/              # Sequelize models
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   ├── OrderItem.js
    │   └── MissingProductReport.js
    ├── routes/              # API routes
    │   ├── auth.js         # Authentication routes
    │   ├── inventory.js    # Product routes
    │   ├── orders.js       # Order routes
    │   └── admin.js        # Admin routes
    ├── db.js               # Database connection
    ├── server.js           # Entry point
    └── package.json
```

## 🔑 Default Admin Access

After setting up the database, you can create an admin user by:

1. Sign up as a regular user through the UI
2. Manually update the user's role in the database:

```sql
UPDATE Users SET role = 'admin' WHERE email = 'your_email@example.com';
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/inventory/products` - Get all products
- `POST /api/inventory/products` - Add product (Admin)
- `PUT /api/inventory/products/:id` - Update product (Admin)
- `DELETE /api/inventory/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/reports` - Get missing product reports

## 🎨 Features Overview

### Customer Journey
1. **Signup/Login** - Create account or login
2. **Browse Products** - View available products in the shop
3. **Add to Cart** - Select products and quantities
4. **Checkout** - Place order and receive bill
5. **View Orders** - Track order history and details

### Admin Journey
1. **Login** - Access admin dashboard
2. **View Analytics** - Monitor sales and inventory
3. **Manage Inventory** - Add/edit/delete products
4. **Process Orders** - View and manage customer orders
5. **Handle Reports** - Respond to missing product requests

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes on both frontend and backend
- Role-based access control (Customer/Admin)
- CORS enabled for secure API access

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Alphavirusboy**
- GitHub: [@Alphavirusboy](https://github.com/Alphavirusboy)

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js community
- MySQL for the robust database
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by Alphavirusboy,Karanpatel8282,Alston Menezes.