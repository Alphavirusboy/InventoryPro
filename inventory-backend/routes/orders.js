import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import MissingProductReport from "../models/MissingProductReport.js";
import { authenticate, isCustomer } from "../middleware/auth.js";

const router = express.Router();

// Create new order (with bill generation) - Guest checkout allowed
router.post("/", async (req, res) => {
  try {
    const { items, customerName = 'Guest User', customerEmail = 'guest@inventorypro.com' } = req.body; // items: [{productId, quantity}]
    const userId = req.user?.id || null; // null for guest users

    let totalAmount = 0;
    const orderItems = [];
    const unavailableProducts = [];

    // Check product availability and calculate total
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        // Report missing product
        unavailableProducts.push({
          productName: product.name,
          requestedQuantity: item.quantity,
          availableStock: product.stock
        });

        // Create missing product report for tracking purposes
        await MissingProductReport.create({
          productName: product.name,
          requestedQuantity: item.quantity - product.stock,
          customerId: userId,
          customerName: customerName
        });

        continue;
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ 
        message: "No products available for order", 
        unavailableProducts 
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      totalAmount,
      customerName,
      customerEmail,
      status: "completed"
    });

    // Create order items and update stock
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      });

      // Update product stock
      const product = await Product.findByPk(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Get complete order with items
    const completeOrder = await Order.findByPk(order.id);
    const items_list = await OrderItem.findAll({ where: { orderId: order.id } });

    res.status(201).json({
      message: "Order created successfully",
      order: completeOrder,
      items: items_list,
      bill: {
        orderId: order.id,
        date: order.createdAt,
        customerName: order.customerName,
        items: items_list,
        totalAmount: order.totalAmount
      },
      unavailableProducts
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
});

// Get user's orders (bills)
router.get("/my-orders", authenticate, isCustomer, async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { userId: req.user.id },
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// Get specific order/bill - Allow guest access
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // For authenticated users, check ownership or admin role
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
        
        // Check if user owns this order or is admin
        if (order.userId !== decoded.id && decoded.role !== "admin") {
          return res.status(403).json({ message: "Access denied" });
        }
      } catch (authError) {
        // Invalid token, but still allow if it's a guest order (userId is null)
        if (order.userId !== null) {
          return res.status(403).json({ message: "Access denied" });
        }
      }
    } else if (order.userId !== null) {
      // No token provided, only allow access to guest orders
      return res.status(403).json({ message: "Access denied" });
    }

    const items = await OrderItem.findAll({ where: { orderId: order.id } });

    res.json({
      order,
      items,
      bill: {
        orderId: order.id,
        date: order.createdAt,
        customerName: order.customerName,
        items,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
});

// Generate Invoice PDF (placeholder - would need PDF generation library)
router.get("/invoice/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // For now, return JSON invoice data
    // In production, you would generate a PDF using libraries like jsPDF or PDFKit
    const invoiceData = {
      invoiceNumber: `INV-${order.id.toString().padStart(6, '0')}`,
      orderDate: order.createdAt,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.OrderItems.map(item => ({
        name: item.Product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })),
      subtotal: order.totalAmount,
      tax: 0, // Can be calculated if needed
      total: order.totalAmount,
      status: order.status
    };

    res.json(invoiceData);
  } catch (error) {
    res.status(500).json({ message: "Error generating invoice", error: error.message });
  }
});

export default router;
