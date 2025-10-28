import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Order = sequelize.define("Order", {
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: true  // Allow null for guest users
  },
  totalAmount: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM("pending", "completed", "cancelled"), 
    defaultValue: "pending" 
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Order;