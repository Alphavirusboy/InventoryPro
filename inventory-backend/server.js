import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import inventoryRoutes from "./routes/inventory.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";

// Import models to ensure they're registered
import "./models/Product.js";
import "./models/User.js";
import "./models/Order.js";
import "./models/OrderItem.js";
import "./models/MissingProductReport.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => res.send("✅ Inventory Management System API"));

const PORT = process.env.PORT || 5000;

// Database and server start
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected and synced");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
