import express from "express";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import MissingProductReport from "../models/MissingProductReport.js";
import { authenticate, isCustomer } from "../middleware/auth.js";

const router = express.Router();

// Create new order (with bill generation)
router.post("/", authenticate, isCustomer, async (req, res) => {
  try {
    const { items } = req.body; // items: [{productId, quantity}]
    const userId = req.user.id;

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

        // Create missing product report
        await MissingProductReport.create({
          productName: product.name,
          requestedQuantity: item.quantity - product.stock,
          customerId: userId,
          customerName: req.user.email
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
      customerName: req.user.email,
      customerEmail: req.user.email,
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
      order: [['createdAt', 'DESC']]
    });

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.findAll({ where: { orderId: order.id } });
        return {
          ...order.toJSON(),
          items
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// Get specific order/bill
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns this order or is admin
    if (order.userId !== req.user.id && req.user.role !== "admin") {
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

export default router;
