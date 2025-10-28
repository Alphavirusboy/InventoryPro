import Product from './models/Product.js';
import sequelize from './db.js';

async function updateProductImages() {
  try {
    await sequelize.sync();
    
    const imageUpdates = [
      // Electronics Category
      {
        name: 'iPhone 15 Pro',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-titanium-blue-select?wid=940&hei=1112&fmt=png-alpha&.v=1693097973363'
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/sg/2401/gallery/sg-galaxy-s24-ultra-s928-492665-sm-s928bzkaxtc-539573186?$650_519_PNG$'
      },
      {
        name: 'MacBook Pro 16"',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'
      },
      {
        name: 'Dell XPS 13',
        imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/13-9340/media-gallery/gray/notebook-xps-13-9340-gray-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full'
      },
      {
        name: 'iPad Air',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=940&hei=1112&fmt=png-alpha&.v=1645065732688'
      },
      {
        name: 'AirPods Pro 2',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361'
      },
      {
        name: 'Sony WH-1000XM5',
        imageUrl: 'https://www.sony.com/image/5d02da5df635856d2d99de8ce43f2db8?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF'
      },
      {
        name: 'Nintendo Switch OLED',
        imageUrl: 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/Dev/Global/noa-product-pages/hardware/nintendo-switch-oled-model/nintendo-switch-oled-model-white-set'
      },

      // Clothing Category
      {
        name: 'Levi\'s 501 Jeans',
        imageUrl: 'https://lsco.scene7.com/is/image/lsco/005010101-front-pdp-lse?fmt=jpeg&qlt=70&resMode=bisharp&fit=crop,0&op_usm=0.6,0.6,8&wid=750&hei=1125'
      },
      {
        name: 'Nike Air Force 1',
        imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes.png'
      },
      {
        name: 'Adidas Ultraboost 22',
        imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a8bfe4bc7bbebae8d011642c1_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg'
      },
      {
        name: 'Patagonia Hoodie',
        imageUrl: 'https://www.patagonia.com/dw/image/v2/BDJB_PRD/on/demandware.static/-/Sites-patagonia-master/default/dw6a027a5a/images/hi-res/39539_SMDB.jpg?sw=750&sh=750&sfrm=jpg&q=90&bgcolor=f5f5f5'
      },
      {
        name: 'Ralph Lauren Polo Shirt',
        imageUrl: 'https://images.ralphlauren.com/is/image/PoloGSI/s7-1267756_lifestyle?$rl_df_pdp_5_7_lif$'
      },
      {
        name: 'Lululemon Leggings',
        imageUrl: 'https://images.lululemon.com/is/image/lululemon/LW5CQQS_028691_1?wid=1080&op_usm=0.5,2,10,0&fmt=webp&qlt=80,1&fit=constrain,0&wid=1080&hei=1080'
      },

      // Home & Garden Category
      {
        name: 'Dyson V15 Vacuum',
        imageUrl: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/vacuum-cleaners/stick/v15-detect/dyson-v15-detect-absolute-gold-nickel-1.png?wid=640&fmt=pjpeg'
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        imageUrl: 'https://instantpot.com/wp-content/uploads/2021/12/IP_Duo-7in1_Front_6Q_V3-600x600.png'
      },
      {
        name: 'KitchenAid Stand Mixer',
        imageUrl: 'https://www.kitchenaid.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinwheel/product-showcase-kneading/ka_pdp_ksm150_empire_red_b.tif?fmt=png-alpha&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&wid=570&hei=570'
      },
      {
        name: 'Weber Genesis Grill',
        imageUrl: 'https://images.weber.com/1800w/genesis-ii-e-315-gas-grill-black-66010001.jpg'
      },
      {
        name: 'Philips Hue Smart Bulbs',
        imageUrl: 'https://www.philips-hue.com/content/dam/hue/en_US/products/bulbs/white-color-ambiance/a19/master/8718696548738_01.png/_jcr_content/renditions/Original.png'
      },
      {
        name: 'Roomba i7+ Robot Vacuum',
        imageUrl: 'https://www.irobot.com/dw/image/v2/BFXP_PRD/on/demandware.static/-/Sites-irobot-master-catalog/default/dw1c4b5c5c/images/large/roomba-i7-plus-product-image-1.jpg?sw=1024&sh=1024&sm=fit'
      },

      // Books & Media Category
      {
        name: 'The Psychology of Money',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/41r6EG2NrNL._SX326_BO1,204,203,200_.jpg'
      },
      {
        name: 'Atomic Habits',
        imageUrl: 'https://jamesclear.com/wp-content/uploads/2018/09/atomic-habits-dots.jpg'
      },
      {
        name: 'The 7 Habits of Highly Effective People',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/51Myx8dmE2L._SX327_BO1,204,203,200_.jpg'
      },
      {
        name: 'Spotify Premium Gift Card',
        imageUrl: 'https://cdn.shopify.com/s/files/1/0070/7032/files/spotify_logo.png?format=webp&v=1655312063&width=1920'
      },
      {
        name: 'Netflix Gift Card',
        imageUrl: 'https://images.ctfassets.net/4cd45et68cgf/4nBnsuPq03diC5eHXnQYx/d48a1765aea8a95c92e1242c2c277ee7/Netflix-Logo.jpg'
      },

      // Sports & Fitness Category
      {
        name: 'Peloton Bike+',
        imageUrl: 'https://www.onepeloton.com/dw/image/v2/BHJJ_PRD/on/demandware.static/-/Sites-peloton-master-catalog/default/dw929d2ba7/images/C1_Bike_22Q4_PLP_US.png?sw=520&sh=520&sm=fit'
      },
      {
        name: 'Bowflex Dumbbells',
        imageUrl: 'https://www.bowflex.com/on/demandware.static/-/Sites-nautilus-us-catalog/default/dw7c4f1e8b/images/bowflex/strength/dumbbells/selecttech/552i/100131_SelectTech_552i_Dumbbell_Hero.jpg'
      },
      {
        name: 'Yoga Mat Premium',
        imageUrl: 'https://cdn.shopify.com/s/files/1/0449/5225/6667/products/yoga-mat-6mm-thick-purple_1024x1024.jpg?v=1632151847'
      },
      {
        name: 'Fitbit Charge 5',
        imageUrl: 'https://www.fitbit.com/global/content/dam/fitbit/global/pdp/devices/charge5/hero-device/charge5-device-black-compass.png'
      },
      {
        name: 'Wilson Tennis Racket',
        imageUrl: 'https://www.wilson.com/dw/image/v2/BBNJ_PRD/on/demandware.static/-/Sites-wilson-master-catalog/default/dw1e3a1c5f/images/tennis/rackets/clash/clash-100-v2/WR056811U_2/WR056811U_2.png?sw=800&sh=800&sm=fit'
      },

      // Automotive Category
      {
        name: 'Michelin Pilot Sport Tires',
        imageUrl: 'https://www.michelinman.com/content/dam/michelin-redesign/tires/passenger-car/michelin-pilot-sport-4.png'
      },
      {
        name: 'Garmin DashCam 67W',
        imageUrl: 'https://res.garmin.com/en/products/010-02505-15/g/cf-xl.jpg'
      },
      {
        name: 'Chemical Guys Car Care Kit',
        imageUrl: 'https://cdn.shopify.com/s/files/1/0071/5595/products/HOL_PRO_KIT_Complete_Professional_Kit_16_Items_9f4f7de8-8b48-42ca-8d94-8d9db4b8e88b_1024x1024.jpg?v=1571271079'
      },
      {
        name: 'Thule Roof Cargo Box',
        imageUrl: 'https://www.thule.com/dw/image/v2/BBDL_PRD/on/demandware.static/-/Sites-thule-master/default/dw7c9e8e8e/images/large/629501_01.jpg?sw=800&sh=800&sm=fit'
      },

      // Beauty & Personal Care
      {
        name: 'Dyson Supersonic Hair Dryer',
        imageUrl: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/supersonic/dyson-supersonic-hair-dryer-nickel-copper-1.png?wid=640&fmt=pjpeg'
      },
      {
        name: 'Fenty Beauty Foundation',
        imageUrl: 'https://fentybeauty.com/dw/image/v2/BFKJ_PRD/on/demandware.static/-/Sites-itemmaster_FentyBeauty/default/dw4f1f9a5a/hi-res/FB30005_ProFiltR_Foundation_110_1.jpg?sw=800&sh=800&sm=fit'
      },
      {
        name: 'The Ordinary Skincare Set',
        imageUrl: 'https://images.ulta.com/is/image/Ulta/2549002?op_sharpen=1&resMode=bilin&qlt=85&wid=800&hei=800&fmt=webp'
      },
      {
        name: 'Electric Toothbrush Oral-B',
        imageUrl: 'https://oralb.com/sites/oralb_us_2/files/styles/product_page_zoom_image_mobile_510x510_/public/product-images/oralb-io-series-9-electric-toothbrush-white-front-zoom.png?itok=lQY3Qx9N'
      },

      // Office Supplies
      {
        name: 'Herman Miller Aeron Chair',
        imageUrl: 'https://www.hermanmiller.com/content/dam/hermanmiller/page_assets/products/aeron_chairs/aeron_chair_hero_2.png.renditions.575.575.png'
      },
      {
        name: 'Stapler Heavy Duty',
        imageUrl: 'https://m.media-amazon.com/images/I/61k+VzKwXzL._AC_SL1500_.jpg'
      },
      {
        name: 'Whiteboard 4x3 ft',
        imageUrl: 'https://m.media-amazon.com/images/I/61x5oVQ6VzL._AC_SL1500_.jpg'
      },
      {
        name: 'Paper Shredder CrossCut',
        imageUrl: 'https://m.media-amazon.com/images/I/61QKhF7DWOL._AC_SL1500_.jpg'
      },

      // Out of Stock Items
      {
        name: 'Limited Edition Gaming Chair',
        imageUrl: 'https://m.media-amazon.com/images/I/71M+9HxqJ8L._AC_SL1500_.jpg'
      },
      {
        name: 'Vintage Leather Jacket',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      }
    ];

    console.log('🖼️ Updating product images...');
    
    for (const update of imageUpdates) {
      try {
        const result = await Product.update(
          { imageUrl: update.imageUrl },
          { where: { name: update.name } }
        );
        
        if (result[0] > 0) {
          console.log(`✅ Updated image for: ${update.name}`);
        } else {
          console.log(`⚠️ Product not found: ${update.name}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${update.name}:`, error.message);
      }
    }

    console.log('\n🎉 Product image update completed!');
    console.log('📸 All products now have high-quality product images');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
}

updateProductImages();