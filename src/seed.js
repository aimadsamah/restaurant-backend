require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maison-noir';

const categories = [
  { name: 'Starters', description: 'Elegant beginnings to your culinary journey', order: 1 },
  { name: 'Seafood', description: 'Fresh from the ocean to your table', order: 2 },
  { name: 'Main Courses', description: 'Masterfully crafted signature dishes', order: 3 },
  { name: 'Desserts', description: 'Sweet finales of exceptional artistry', order: 4 },
  { name: 'Drinks', description: 'Curated wines and artisanal beverages', order: 5 },
];

const menuItemsData = [
  // Starters
  {
    name: 'Foie Gras Terrine',
    description: 'Hudson Valley foie gras with Sauternes gelée, brioche toast, and seasonal chutney',
    price: 38,
    categoryName: 'Starters',
    featured: true,
    tags: ['signature', 'chef-special'],
    allergens: ['gluten', 'dairy'],
    preparationTime: 15,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'
  },
  {
    name: 'Burrata & Heirloom Tomatoes',
    description: 'Imported burrata with heirloom tomatoes, aged balsamic, fresh basil oil, and sea salt flakes',
    price: 24,
    categoryName: 'Starters',
    featured: false,
    tags: ['vegetarian'],
    allergens: ['dairy'],
    preparationTime: 10,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80'
  },
  {
    name: 'Black Truffle Velouté',
    description: 'Silken cauliflower velouté with shaved black truffle, hazelnut foam, and chive oil',
    price: 32,
    categoryName: 'Starters',
    featured: true,
    tags: ['vegetarian', 'signature'],
    allergens: ['nuts', 'dairy'],
    preparationTime: 20,
    image: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&q=80'
  },
  {
    name: 'Wagyu Beef Tartare',
    description: 'A4 Wagyu hand-cut tartare with quail egg, capers, cornichons, and toasted sourdough',
    price: 42,
    categoryName: 'Starters',
    featured: true,
    tags: ['signature', 'chef-special'],
    allergens: ['eggs', 'gluten'],
    preparationTime: 15,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'
  },

  // Seafood
  {
    name: 'Dover Sole Meunière',
    description: 'Whole Dover sole pan-roasted in brown butter with capers, lemon, and fresh herbs',
    price: 68,
    categoryName: 'Seafood',
    featured: true,
    tags: ['classic', 'chef-special'],
    allergens: ['fish', 'dairy', 'gluten'],
    preparationTime: 25,
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80'
  },
  {
    name: 'Langoustine Bisque',
    description: 'Breton langoustines poached in bisque with saffron cream, caviar, and micro herbs',
    price: 56,
    categoryName: 'Seafood',
    featured: true,
    tags: ['signature'],
    allergens: ['shellfish', 'dairy'],
    preparationTime: 30,
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80'
  },
  {
    name: 'Atlantic Halibut',
    description: 'Pan-seared halibut with sunchoke purée, wild mushrooms, and Champagne beurre blanc',
    price: 54,
    categoryName: 'Seafood',
    featured: false,
    tags: ['seasonal'],
    allergens: ['fish', 'dairy'],
    preparationTime: 25,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80'
  },

  // Main Courses
  {
    name: 'Dry-Aged Côte de Bœuf',
    description: '45-day dry-aged prime rib for two, with bone marrow butter, truffle pommes purée, and seasonal vegetables',
    price: 145,
    categoryName: 'Main Courses',
    featured: true,
    tags: ['signature', 'for-two', 'chef-special'],
    allergens: ['dairy'],
    preparationTime: 45,
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80'
  },
  {
    name: 'Roasted Duck Breast',
    description: 'Magret duck breast with cherry jus, duck leg confit, celeriac gratin, and micro greens',
    price: 62,
    categoryName: 'Main Courses',
    featured: true,
    tags: ['signature'],
    allergens: ['dairy'],
    preparationTime: 35,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'
  },
  {
    name: 'Rack of Lamb Persillé',
    description: 'French rack of lamb with herb crust, Provençal vegetables, rosemary jus, and lavender salt',
    price: 78,
    categoryName: 'Main Courses',
    featured: false,
    tags: ['classic'],
    allergens: ['gluten', 'dairy'],
    preparationTime: 40,
    image: 'https://images.unsplash.com/photo-1544025162-d76594e8bb5c?w=800&q=80'
  },
  {
    name: 'Wild Mushroom Risotto',
    description: 'Arborio risotto with porcini, chanterelle, and truffle oil, finished with aged Parmigiano-Reggiano',
    price: 44,
    categoryName: 'Main Courses',
    featured: false,
    tags: ['vegetarian'],
    allergens: ['dairy'],
    preparationTime: 30,
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80'
  },

  // Desserts
  {
    name: 'Valrhona Chocolate Soufflé',
    description: 'Dark chocolate soufflé with Tahitian vanilla ice cream and gold leaf decoration',
    price: 24,
    categoryName: 'Desserts',
    featured: true,
    tags: ['signature', 'chef-special'],
    allergens: ['dairy', 'eggs', 'gluten'],
    preparationTime: 20,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80'
  },
  {
    name: 'Crème Brûlée Grand Cru',
    description: 'Tahitian vanilla bean crème brûlée with caramelized sugar crust and seasonal berry compote',
    price: 18,
    categoryName: 'Desserts',
    featured: false,
    tags: ['classic', 'vegetarian'],
    allergens: ['dairy', 'eggs'],
    preparationTime: 15,
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80'
  },
  {
    name: 'Tarte Tatin aux Poires',
    description: 'Caramelized pear tarte tatin with Calvados caramel, whipped crème fraîche, and walnut praline',
    price: 22,
    categoryName: 'Desserts',
    featured: false,
    tags: ['seasonal', 'vegetarian'],
    allergens: ['gluten', 'dairy', 'nuts'],
    preparationTime: 20,
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80'
  },

  // Drinks
  {
    name: 'Château Pétrus 2015',
    description: 'Exceptional Pomerol with notes of plum, black cherry, and earthy mineral complexity',
    price: 1200,
    categoryName: 'Drinks',
    featured: true,
    tags: ['wine', 'red', 'fine-wine'],
    allergens: ['sulphites'],
    preparationTime: 5,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80'
  },
  {
    name: 'Krug Grande Cuvée Champagne',
    description: 'Multi-vintage champagne with extraordinary depth, freshness, and biscuity complexity',
    price: 380,
    categoryName: 'Drinks',
    featured: true,
    tags: ['champagne', 'sparkling'],
    allergens: ['sulphites'],
    preparationTime: 5,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
  },
  {
    name: 'Maison Noir Signature Cocktail',
    description: 'Aged cognac, elderflower liqueur, fresh yuzu, activated charcoal ice, and edible gold',
    price: 28,
    categoryName: 'Drinks',
    featured: true,
    tags: ['cocktail', 'signature'],
    allergens: [],
    preparationTime: 8,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80'
  },
  {
    name: 'Still & Sparkling Waters',
    description: 'Acqua Panna still or San Pellegrino sparkling, chilled to perfection',
    price: 8,
    categoryName: 'Drinks',
    featured: false,
    tags: ['non-alcoholic'],
    allergens: [],
    preparationTime: 2,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      MenuItem.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Maison Noir Admin',
      email: process.env.ADMIN_EMAIL || 'admin@maisonnoir.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'superadmin'
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`📂 Created ${createdCategories.length} categories`);

    // Map category names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => { categoryMap[cat.name] = cat._id; });

    // Create menu items
    const itemsWithCategoryIds = menuItemsData.map(item => ({
      ...item,
      category: categoryMap[item.categoryName],
      categoryName: undefined
    }));

    const createdItems = await MenuItem.insertMany(itemsWithCategoryIds);
    console.log(`🍽️  Created ${createdItems.length} menu items`);

    console.log('\n✨ Seed completed successfully!');
    console.log(`📧 Admin Login: ${admin.email}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
