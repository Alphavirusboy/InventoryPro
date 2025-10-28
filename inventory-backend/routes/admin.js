import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import MissingProductReport from "../models/MissingProductReport.js";
import User from "../models/User.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import { Sequelize } from "sequelize";

const router = express.Router();

// Admin product management routes
router.delete("/products/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

router.patch("/products/:id/stock", authenticate, isAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.update({ stock });
    res.json({ message: "Stock updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error: error.message });
  }
});

// Get all orders (admin only)
router.get("/orders", authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.findAll({ where: { orderId: order.id } });
        return { ...order.toJSON(), items };
      })
    );
    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// Get missing product reports
router.get("/missing-products", authenticate, isAdmin, async (req, res) => {
  try {
    const reports = await MissingProductReport.findAll({ 
      where: { status: "pending" },
      order: [['requestCount', 'DESC'], ['createdAt', 'DESC']] 
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports", error: error.message });
  }
});

// Update missing product report status
router.patch("/missing-products/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const report = await MissingProductReport.findByPk(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();
    
    res.json({ message: "Report updated", report });
  } catch (error) {
    res.status(500).json({ message: "Error updating report", error: error.message });
  }
});

// Get analytics data
router.get("/analytics/dashboard", authenticate, isAdmin, async (req, res) => {
  try {
    // Total revenue
    const totalRevenue = await Order.sum('totalAmount', { where: { status: 'completed' } });

    // Total orders
    const totalOrders = await Order.count();

    // Low stock products
    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [Sequelize.Op.lte]: Sequelize.col('lowStockThreshold')
        }
      }
    });

    // Sales by product (top selling)
    const topProducts = await OrderItem.findAll({
      attributes: [
        'productName',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold'],
        [Sequelize.fn('SUM', Sequelize.col('subtotal')), 'totalRevenue']
      ],
      group: ['productName'],
      order: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'DESC']],
      limit: 10
    });

    // Sales over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesOverTime = await Order.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'orderCount'],
        [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'revenue']
      ],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: thirtyDaysAgo
        }
      },
      group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']]
    });

    // Category-wise sales
    const categorySales = await OrderItem.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('OrderItem.id')), 'itemCount'],
        [Sequelize.fn('SUM', Sequelize.col('subtotal')), 'revenue']
      ],
      include: [{
        model: Product,
        attributes: ['category'],
        required: true
      }],
      group: ['Product.category']
    });

    res.json({
      summary: {
        totalRevenue: totalRevenue || 0,
        totalOrders,
        lowStockCount: lowStockProducts.length,
        lowStockProducts
      },
      topProducts,
      salesOverTime,
      categorySales
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
});

// Update product stock (admin only)
router.patch("/products/:id/stock", authenticate, isAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = stock;
    await product.save();
    
    res.json({ message: "Stock updated", product });
  } catch (error) {
    res.status(500).json({ message: "Error updating stock", error: error.message });
  }
});

// Delete product (admin only)
router.delete("/products/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

// Dashboard stats
router.get("/dashboard-stats", authenticate, isAdmin, async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalRevenue, topProducts] = await Promise.all([
      Order.count(),
      Product.count(),
      Order.sum('totalAmount'),
      OrderItem.findAll({
        attributes: [
          'productId',
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalSold']
        ],
        include: [Product],
        group: ['productId', 'Product.id'],
        order: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'DESC']],
        limit: 5
      })
    ]);

    // Get total users count
    const totalUsers = await User.count();

    res.json({
      totalOrders: totalOrders || 0,
      totalProducts: totalProducts || 0,
      totalRevenue: parseFloat(totalRevenue || 0).toFixed(2),
      totalUsers,
      topProducts: topProducts.map(item => ({
        id: item.Product.id,
        name: item.Product.name,
        totalSold: item.dataValues.totalSold
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
});

// Recent orders
router.get("/recent-orders", authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent orders", error: error.message });
  }
});

// Low stock products
router.get("/low-stock", authenticate, isAdmin, async (req, res) => {
  try {
    const lowStockProducts = await Product.findAll({
      where: {
        stock: {
          [Sequelize.Op.lte]: 10
        }
      },
      order: [['stock', 'ASC']]
    });

    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching low stock products", error: error.message });
  }
});

// Get all users
router.get("/users", authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Delete user
router.delete("/users/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: "Cannot delete admin user" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

// Update order status
router.put("/orders/:id/status", authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status });
    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
});

export default router;
