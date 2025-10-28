import Product from './models/Product.js';
import sequelize from './db.js';

async function cleanupInventory() {
  try {
    await sequelize.sync();
    
    // Products to keep (high-quality items with good images)
    const productsToKeep = [
      'iPhone 15 Pro',
      'Samsung Galaxy S24 Ultra',
      'MacBook Pro 16"',
      'iPad Air',
      'AirPods Pro 2',
      'Sony WH-1000XM5',
      'Nintendo Switch OLED',
      'Nike Air Force 1',
      'Adidas Ultraboost 22',
      'Levi\'s 501 Jeans',
      'Patagonia Hoodie',
      'Dyson V15 Vacuum',
      'Instant Pot Duo 7-in-1',
      'KitchenAid Stand Mixer',
      'Philips Hue Smart Bulbs',
      'The Psychology of Money',
      'Atomic Habits',
      'Spotify Premium Gift Card',
      'Netflix Gift Card',
      'Peloton Bike+',
      'Bowflex Dumbbells',
      'Yoga Mat Premium',
      'Fitbit Charge 5',
      'Dyson Supersonic Hair Dryer',
      'Herman Miller Aeron Chair'
    ];
    
    console.log('🧹 Cleaning up inventory...');
    
    // Delete products not in the keep list
    const deleteResult = await Product.destroy({
      where: {
        name: {
          [sequelize.Sequelize.Op.notIn]: productsToKeep
        }
      }
    });
    
    console.log(`🗑️ Removed ${deleteResult} products from inventory`);
    
    // Get remaining products count
    const remainingCount = await Product.count();
    console.log(`📦 ${remainingCount} products remaining in inventory`);
    
    // List remaining products by category
    const categories = await Product.findAll({
      attributes: ['category', [sequelize.fn('COUNT', 'id'), 'count']],
      group: ['category'],
      raw: true
    });
    
    console.log('\n📊 Updated Inventory by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat.count} products`);
    });
    
    console.log('\n✨ Inventory cleanup completed!');
    console.log('🎯 Kept only high-quality products with proper images');
    
  } catch (error) {
    console.error('❌ Error cleaning inventory:', error);
  }
}

cleanupInventory();