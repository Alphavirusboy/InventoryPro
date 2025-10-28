import Product from './models/Product.js';
import sequelize from './db.js';

async function addDiverseInventory() {
  try {
    await sequelize.sync();
    
    // Clear existing products first
    await Product.destroy({ where: {} });
    console.log('🗑️ Cleared existing inventory');
    
    // Comprehensive product catalog
    const products = [
      // Electronics Category
      {
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with A17 Pro chip, titanium design, and advanced camera system',
        category: 'Electronics',
        price: 999.99,
        stock: 25,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=iPhone+15+Pro'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
        category: 'Electronics',
        price: 1199.99,
        stock: 18,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Galaxy+S24'
      },
      {
        name: 'MacBook Pro 16"',
        description: 'Powerful laptop with M3 Pro chip, Liquid Retina XDR display, perfect for professionals',
        category: 'Electronics',
        price: 2499.99,
        stock: 12,
        lowStockThreshold: 3,
        imageUrl: 'https://via.placeholder.com/300x300/c0c0c0/000000?text=MacBook+Pro'
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultra-portable Windows laptop with Intel Core i7, 16GB RAM, and premium build quality',
        category: 'Electronics',
        price: 1299.99,
        stock: 15,
        lowStockThreshold: 3,
        imageUrl: 'https://via.placeholder.com/300x300/2c3e50/ffffff?text=Dell+XPS'
      },
      {
        name: 'iPad Air',
        description: 'Versatile tablet with M2 chip, Apple Pencil support, perfect for creativity and productivity',
        category: 'Electronics',
        price: 599.99,
        stock: 30,
        lowStockThreshold: 8,
        imageUrl: 'https://via.placeholder.com/300x300/f8f9fa/2c3e50?text=iPad+Air'
      },
      {
        name: 'AirPods Pro 2',
        description: 'Premium wireless earbuds with active noise cancellation and spatial audio',
        category: 'Electronics',
        price: 249.99,
        stock: 45,
        lowStockThreshold: 10,
        imageUrl: 'https://via.placeholder.com/300x300/ffffff/000000?text=AirPods+Pro'
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling wireless headphones with premium sound quality',
        category: 'Electronics',
        price: 399.99,
        stock: 22,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Sony+WH-1000XM5'
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Popular gaming console with vibrant OLED screen and versatile play modes',
        category: 'Electronics',
        price: 349.99,
        stock: 28,
        lowStockThreshold: 8,
        imageUrl: 'https://via.placeholder.com/300x300/e74c3c/ffffff?text=Switch+OLED'
      },

      // Clothing Category
      {
        name: 'Levi\'s 501 Jeans',
        description: 'Classic straight-leg denim jeans, authentic fit, premium quality cotton',
        category: 'Clothing',
        price: 89.99,
        stock: 50,
        lowStockThreshold: 15,
        imageUrl: 'https://via.placeholder.com/300x300/2980b9/ffffff?text=Levi\'s+501'
      },
      {
        name: 'Nike Air Force 1',
        description: 'Iconic basketball sneakers with classic white leather design and Air cushioning',
        category: 'Clothing',
        price: 119.99,
        stock: 35,
        lowStockThreshold: 10,
        imageUrl: 'https://via.placeholder.com/300x300/ffffff/000000?text=Air+Force+1'
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'High-performance running shoes with Boost technology and Primeknit upper',
        category: 'Clothing',
        price: 179.99,
        stock: 28,
        lowStockThreshold: 8,
        imageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Ultraboost'
      },
      {
        name: 'Patagonia Hoodie',
        description: 'Sustainable organic cotton hoodie, perfect for outdoor adventures and casual wear',
        category: 'Clothing',
        price: 129.99,
        stock: 32,
        lowStockThreshold: 10,
        imageUrl: 'https://via.placeholder.com/300x300/27ae60/ffffff?text=Patagonia'
      },
      {
        name: 'Ralph Lauren Polo Shirt',
        description: 'Classic polo shirt in premium cotton pique with iconic polo player logo',
        category: 'Clothing',
        price: 79.99,
        stock: 40,
        lowStockThreshold: 12,
        imageUrl: 'https://via.placeholder.com/300x300/3498db/ffffff?text=Polo+Shirt'
      },
      {
        name: 'Lululemon Leggings',
        description: 'High-waisted athletic leggings with four-way stretch and sweat-wicking fabric',
        category: 'Clothing',
        price: 128.99,
        stock: 25,
        lowStockThreshold: 8,
        imageUrl: 'https://via.placeholder.com/300x300/9b59b6/ffffff?text=Lululemon'
      },

      // Home & Garden Category
      {
        name: 'Dyson V15 Vacuum',
        description: 'Powerful cordless vacuum with laser dust detection and intelligent suction',
        category: 'Home & Garden',
        price: 749.99,
        stock: 14,
        lowStockThreshold: 4,
        imageUrl: 'https://via.placeholder.com/300x300/f39c12/ffffff?text=Dyson+V15'
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        description: 'Multi-functional pressure cooker, slow cooker, rice cooker, and more in one appliance',
        category: 'Home & Garden',
        price: 99.99,
        stock: 35,
        lowStockThreshold: 10,
        imageUrl: 'https://via.placeholder.com/300x300/e74c3c/ffffff?text=Instant+Pot'
      },
      {
        name: 'KitchenAid Stand Mixer',
        description: 'Professional-grade stand mixer with 5-quart bowl, perfect for baking enthusiasts',
        category: 'Home & Garden',
        price: 349.99,
        stock: 18,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/e74c3c/ffffff?text=KitchenAid'
      },
      {
        name: 'Weber Genesis Grill',
        description: 'Premium gas grill with three burners, porcelain-enameled cast iron grates',
        category: 'Home & Garden',
        price: 899.99,
        stock: 8,
        lowStockThreshold: 2,
        imageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Weber+Grill'
      },
      {
        name: 'Philips Hue Smart Bulbs',
        description: 'Color-changing smart LED bulbs controllable via smartphone app, pack of 4',
        category: 'Home & Garden',
        price: 199.99,
        stock: 42,
        lowStockThreshold: 12,
        imageUrl: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Hue+Bulbs'
      },
      {
        name: 'Roomba i7+ Robot Vacuum',
        description: 'Smart robot vacuum with automatic dirt disposal and mapping technology',
        category: 'Home & Garden',
        price: 599.99,
        stock: 16,
        lowStockThreshold: 4,
        imageUrl: 'https://via.placeholder.com/300x300/34495e/ffffff?text=Roomba+i7'
      },

      // Books & Media Category
      {
        name: 'The Psychology of Money',
        description: 'Bestselling book about personal finance and investing psychology by Morgan Housel',
        category: 'Books & Media',
        price: 16.99,
        stock: 75,
        lowStockThreshold: 20,
        imageUrl: 'https://via.placeholder.com/300x300/2c3e50/ffffff?text=Psychology+Money'
      },
      {
        name: 'Atomic Habits',
        description: 'Life-changing book about building good habits and breaking bad ones by James Clear',
        category: 'Books & Media',
        price: 18.99,
        stock: 68,
        lowStockThreshold: 20,
        imageUrl: 'https://via.placeholder.com/300x300/27ae60/ffffff?text=Atomic+Habits'
      },
      {
        name: 'The 7 Habits of Highly Effective People',
        description: 'Classic self-help book on personal and professional effectiveness by Stephen Covey',
        category: 'Books & Media',
        price: 14.99,
        stock: 55,
        lowStockThreshold: 15,
        imageUrl: 'https://via.placeholder.com/300x300/3498db/ffffff?text=7+Habits'
      },
      {
        name: 'Spotify Premium Gift Card',
        description: '12-month subscription to Spotify Premium music streaming service',
        category: 'Books & Media',
        price: 119.88,
        stock: 100,
        lowStockThreshold: 25,
        imageUrl: 'https://via.placeholder.com/300x300/1DB954/ffffff?text=Spotify+Gift'
      },
      {
        name: 'Netflix Gift Card',
        description: '$50 Netflix gift card for streaming movies, TV shows, and original content',
        category: 'Books & Media',
        price: 50.00,
        stock: 150,
        lowStockThreshold: 30,
        imageUrl: 'https://via.placeholder.com/300x300/E50914/ffffff?text=Netflix+Gift'
      },

      // Sports & Fitness Category
      {
        name: 'Peloton Bike+',
        description: 'Premium indoor cycling bike with rotating HD touchscreen and live classes',
        category: 'Sports & Fitness',
        price: 2495.00,
        stock: 6,
        lowStockThreshold: 2,
        imageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Peloton+Bike'
      },
      {
        name: 'Bowflex Dumbbells',
        description: 'Adjustable dumbbells that replace 15 sets of weights, space-saving design',
        category: 'Sports & Fitness',
        price: 349.99,
        stock: 20,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/2c3e50/ffffff?text=Bowflex+Weights'
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Extra-thick non-slip yoga mat with alignment lines and carrying strap',
        category: 'Sports & Fitness',
        price: 49.99,
        stock: 60,
        lowStockThreshold: 15,
        imageUrl: 'https://via.placeholder.com/300x300/9b59b6/ffffff?text=Yoga+Mat'
      },
      {
        name: 'Fitbit Charge 5',
        description: 'Advanced fitness tracker with GPS, heart rate monitoring, and health insights',
        category: 'Sports & Fitness',
        price: 179.99,
        stock: 35,
        lowStockThreshold: 10,
        imageUrl: 'https://via.placeholder.com/300x300/4285f4/ffffff?text=Fitbit+Charge'
      },
      {
        name: 'Wilson Tennis Racket',
        description: 'Professional-grade tennis racket with graphite frame and comfortable grip',
        category: 'Sports & Fitness',
        price: 129.99,
        stock: 24,
        lowStockThreshold: 6,
        imageUrl: 'https://via.placeholder.com/300x300/e74c3c/ffffff?text=Tennis+Racket'
      },

      // Automotive Category
      {
        name: 'Michelin Pilot Sport Tires',
        description: 'High-performance tires for sports cars and luxury vehicles, set of 4',
        category: 'Automotive',
        price: 899.99,
        stock: 12,
        lowStockThreshold: 3,
        imageUrl: 'https://via.placeholder.com/300x300/1a1a1a/ffffff?text=Michelin+Tires'
      },
      {
        name: 'Garmin DashCam 67W',
        description: 'Ultra-wide dashboard camera with 4K recording and voice control',
        category: 'Automotive',
        price: 229.99,
        stock: 18,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/2c3e50/ffffff?text=Garmin+DashCam'
      },
      {
        name: 'Chemical Guys Car Care Kit',
        description: 'Complete car detailing kit with premium wash, wax, and microfiber cloths',
        category: 'Automotive',
        price: 89.99,
        stock: 30,
        lowStockThreshold: 8,
        imageUrl: 'https://via.placeholder.com/300x300/f39c12/ffffff?text=Car+Care+Kit'
      },
      {
        name: 'Thule Roof Cargo Box',
        description: 'Aerodynamic roof cargo carrier with secure dual-side opening system',
        category: 'Automotive',
        price: 549.99,
        stock: 10,
        lowStockThreshold: 3,
        imageUrl: 'https://via.placeholder.com/300x300/34495e/ffffff?text=Thule+Cargo'
      },

      // Beauty & Personal Care
      {
        name: 'Dyson Supersonic Hair Dryer',
        description: 'Revolutionary hair dryer with intelligent heat control and magnetic attachments',
        category: 'Beauty & Personal Care',
        price: 429.99,
        stock: 22,
        lowStockThreshold: 6,
        imageUrl: 'https://via.placeholder.com/300x300/667eea/ffffff?text=Dyson+Hair'
      },
      {
        name: 'Fenty Beauty Foundation',
        description: 'Inclusive foundation with 50 shades for all skin tones, long-wearing formula',
        category: 'Beauty & Personal Care',
        price: 38.99,
        stock: 45,
        lowStockThreshold: 12,
        imageUrl: 'https://via.placeholder.com/300x300/ff6b9d/ffffff?text=Fenty+Beauty'
      },
      {
        name: 'The Ordinary Skincare Set',
        description: 'Complete skincare routine with serums, moisturizer, and cleanser',
        category: 'Beauty & Personal Care',
        price: 79.99,
        stock: 38,
        lowStockThreshold: 10,
        imageUrl: 'https://via.placeholder.com/300x300/f8f9fa/2c3e50?text=Skincare+Set'
      },
      {
        name: 'Electric Toothbrush Oral-B',
        description: 'Rechargeable electric toothbrush with pressure sensor and multiple cleaning modes',
        category: 'Beauty & Personal Care',
        price: 99.99,
        stock: 28,
        lowStockThreshold: 8,
        imageUrl: 'https://via.placeholder.com/300x300/3498db/ffffff?text=Electric+Brush'
      },

      // Office Supplies
      {
        name: 'Herman Miller Aeron Chair',
        description: 'Ergonomic office chair with breathable mesh and adjustable lumbar support',
        category: 'Office Supplies',
        price: 1395.00,
        stock: 8,
        lowStockThreshold: 2,
        imageUrl: 'https://via.placeholder.com/300x300/2c3e50/ffffff?text=Aeron+Chair'
      },
      {
        name: 'Stapler Heavy Duty',
        description: 'Professional-grade stapler for high-volume office use, 100-sheet capacity',
        category: 'Office Supplies',
        price: 34.99,
        stock: 45,
        lowStockThreshold: 12,
        imageUrl: 'https://via.placeholder.com/300x300/95a5a6/ffffff?text=Heavy+Stapler'
      },
      {
        name: 'Whiteboard 4x3 ft',
        description: 'Magnetic dry erase whiteboard with aluminum frame and marker tray',
        category: 'Office Supplies',
        price: 89.99,
        stock: 15,
        lowStockThreshold: 4,
        imageUrl: 'https://via.placeholder.com/300x300/ffffff/2c3e50?text=Whiteboard'
      },
      {
        name: 'Paper Shredder CrossCut',
        description: 'Secure document shredder with 12-sheet capacity and credit card destruction',
        category: 'Office Supplies',
        price: 149.99,
        stock: 20,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/34495e/ffffff?text=Paper+Shredder'
      },

      // Out of Stock Items (for testing)
      {
        name: 'Limited Edition Gaming Chair',
        description: 'Ultra-premium gaming chair with RGB lighting and massage function - SOLD OUT',
        category: 'Electronics',
        price: 799.99,
        stock: 0,
        lowStockThreshold: 5,
        imageUrl: 'https://via.placeholder.com/300x300/e74c3c/ffffff?text=SOLD+OUT'
      },
      {
        name: 'Vintage Leather Jacket',
        description: 'Authentic vintage leather jacket from the 80s - COLLECTOR\'S ITEM',
        category: 'Clothing',
        price: 299.99,
        stock: 0,
        lowStockThreshold: 3,
        imageUrl: 'https://via.placeholder.com/300x300/8e44ad/ffffff?text=VINTAGE+SOLD'
      }
    ];

    // Insert all products
    for (const product of products) {
      await Product.create(product);
    }

    console.log(`✅ Successfully added ${products.length} diverse products to inventory!`);
    console.log('📦 Categories included: Electronics, Clothing, Home & Garden, Books & Media, Sports & Fitness, Automotive, Beauty & Personal Care, Office Supplies');
    
    // Display summary by category
    const categorySummary = {};
    products.forEach(product => {
      categorySummary[product.category] = (categorySummary[product.category] || 0) + 1;
    });
    
    console.log('\n📊 Inventory Summary by Category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error adding inventory:', error);
  }
}

addDiverseInventory();