import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';
import Product from './models/Product.js';
import User from './models/User.js';
import sequelize from './db.js';

async function createTestOrders() {
  try {
    await sequelize.sync();

    // Get some products for test orders
    const products = await Product.findAll({ limit: 5 });
    if (products.length === 0) {
      console.log('❌ No products found. Please run addDiverseInventory.js first');
      return;
    }

    // Get a test user (admin or customer)
    const user = await User.findOne({ where: { email: 'customer@test.com' } });
    
    console.log('📦 Creating test orders...');

    // Create test order 1
    const order1 = await Order.create({
      userId: user ? user.id : null,
      totalAmount: 0, // Will be calculated
      status: 'completed',
      customerName: user ? user.name : 'John Doe',
      customerEmail: user ? user.email : 'john.doe@example.com'
    });

    // Add items to order 1
    let order1Total = 0;
    const orderItems1 = [
      { productId: products[0].id, quantity: 2 },
      { productId: products[1].id, quantity: 1 }
    ];

    for (const item of orderItems1) {
      const product = await Product.findByPk(item.productId);
      const subtotal = product.price * item.quantity;
      order1Total += subtotal;

      await OrderItem.create({
        orderId: order1.id,
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal
      });
    }

    // Update order total
    await order1.update({ totalAmount: order1Total });

    // Create test order 2
    const order2 = await Order.create({
      userId: user ? user.id : null,
      totalAmount: 0, // Will be calculated
      status: 'pending',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com'
    });

    // Add items to order 2
    let order2Total = 0;
    const orderItems2 = [
      { productId: products[2].id, quantity: 1 },
      { productId: products[3].id, quantity: 3 },
      { productId: products[4].id, quantity: 1 }
    ];

    for (const item of orderItems2) {
      const product = await Product.findByPk(item.productId);
      const subtotal = product.price * item.quantity;
      order2Total += subtotal;

      await OrderItem.create({
        orderId: order2.id,
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal
      });
    }

    // Update order total
    await order2.update({ totalAmount: order2Total });

    console.log('✅ Created test orders successfully!');
    console.log(`📋 Order 1 ID: ${order1.id} - Total: $${order1Total.toFixed(2)} - Status: ${order1.status}`);
    console.log(`📋 Order 2 ID: ${order2.id} - Total: $${order2Total.toFixed(2)} - Status: ${order2.status}`);
    console.log('');
    console.log('🔗 Test invoice URLs:');
    console.log(`   http://localhost:3000/invoice/${order1.id}`);
    console.log(`   http://localhost:3000/invoice/${order2.id}`);
    console.log('');
    console.log('🖨️ You can now test the print functionality!');

  } catch (error) {
    console.error('❌ Error creating test orders:', error);
  }
}

createTestOrders();