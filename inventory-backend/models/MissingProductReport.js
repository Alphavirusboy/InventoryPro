import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const MissingProductReport = sequelize.define("MissingProductReport", {
  productName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  requestedQuantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  customerId: { 
    type: DataTypes.INTEGER, 
    allowNull: true  // Allow null for guest users
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: { 
    type: DataTypes.ENUM("pending", "restocked", "dismissed"), 
    defaultValue: "pending" 
  },
  requestCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

export default MissingProductReport;
