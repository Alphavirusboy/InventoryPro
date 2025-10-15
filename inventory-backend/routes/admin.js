import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import MissingProductReport from "../models/MissingProductReport.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import { Sequelize } from "sequelize";

const router = express.Router();

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

export default router;
