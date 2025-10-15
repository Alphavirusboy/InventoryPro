import express from "express";
import Product from "../models/Product.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import { Sequelize } from "sequelize";

const router = express.Router();

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.name = {
        [Sequelize.Op.like]: `%${search}%`
      };
    }

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    const products = await Product.findAll({ where: whereClause });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// Get product by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

// Create product (admin only)
router.post("/", authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, category, price, stock, lowStockThreshold, imageUrl } = req.body;
    const product = await Product.create({ 
      name, 
      description, 
      category, 
      price, 
      stock, 
      lowStockThreshold,
      imageUrl 
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
});

// Update product (admin only)
router.put("/:id", authenticate, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, category, price, stock, lowStockThreshold, imageUrl } = req.body;
    await product.update({ 
      name, 
      description, 
      category, 
      price, 
      stock, 
      lowStockThreshold,
      imageUrl 
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

// Get all categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
      where: {
        category: {
          [Sequelize.Op.ne]: null
        }
      }
    });
    res.json(categories.map(c => c.category));
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

export default router;
