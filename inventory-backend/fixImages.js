import Product from './models/Product.js';
import sequelize from './db.js';

async function fixFailedImages() {
  try {
    await sequelize.sync({ alter: true }); // This will update the column size
    
    const fixedUpdates = [
      {
        name: 'Dell XPS 13',
        imageUrl: 'https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/13-9340/media-gallery/gray/notebook-xps-13-9340-gray-gallery-1.psd?fmt=png-alpha&wid=300&hei=300'
      },
      {
        name: 'KitchenAid Stand Mixer',
        imageUrl: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/products/KSM150PSER_62c18fb0-9c28-4969-ad7a-ae54c4e9b3b6_300x300.jpg'
      }
    ];

    console.log('🔧 Fixing failed image updates...');
    
    for (const update of fixedUpdates) {
      try {
        const result = await Product.update(
          { imageUrl: update.imageUrl },
          { where: { name: update.name } }
        );
        
        if (result[0] > 0) {
          console.log(`✅ Fixed image for: ${update.name}`);
        } else {
          console.log(`⚠️ Product not found: ${update.name}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${update.name}:`, error.message);
      }
    }

    console.log('\n🎉 Image fixes completed!');
    
  } catch (error) {
    console.error('❌ Error fixing images:', error);
  }
}

fixFailedImages();