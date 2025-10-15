import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const OrderItem = sequelize.define("OrderItem", {
  orderId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

export default OrderItem;
