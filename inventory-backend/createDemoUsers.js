import User from './models/User.js';
import bcrypt from 'bcryptjs';
import sequelize from './db.js';

async function createDemoUsers() {
  try {
    await sequelize.sync();
    
    // Create admin user
    const adminExists = await User.findOne({ where: { email: 'admin@inventorypro.com' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@inventorypro.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@inventorypro.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    // Create customer user
    const customerExists = await User.findOne({ where: { email: 'customer@inventorypro.com' } });
    if (!customerExists) {
      const hashedPassword = await bcrypt.hash('customer123', 10);
      await User.create({
        name: 'Customer User',
        email: 'customer@inventorypro.com',
        password: hashedPassword,
        role: 'customer'
      });
      console.log('✅ Customer user created: customer@inventorypro.com / customer123');
    } else {
      console.log('Customer user already exists');
    }
    
    console.log('🎉 Demo users setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo users:', error);
    process.exit(1);
  }
}

createDemoUsers();