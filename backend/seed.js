/**
 * BiteQR Demo Data Seed Script
 * Run inside the backend container:
 *   docker compose exec backend node seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/biteqr';

// ── Schemas (inline so this file is self-contained) ─────────────
const categorySchema = new mongoose.Schema({ name: String, order: Number });
const Category = mongoose.model('Category', categorySchema);

const itemSchema = new mongoose.Schema({
  name: String, description: String, price: Number, image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isAvailable: Boolean, isVeg: Boolean, isEgg: Boolean, isSpicy: Boolean,
});
const Item = mongoose.model('MenuItem', itemSchema);

const tableSchema = new mongoose.Schema({ number: String });
const Table = mongoose.model('Table', tableSchema);

const settingsSchema = new mongoose.Schema({
  _id: String, restaurantName: String, phoneNumber: String,
  currency: String, currencySymbol: String, logoUrl: String,
  address: String, taxRate: Number,
});
const Settings = mongoose.model('Settings', settingsSchema, 'settings');

// ── Seed Data ────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Wipe existing data
  await Promise.all([
    Category.deleteMany({}),
    Item.deleteMany({}),
    Table.deleteMany({}),
    Settings.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // 1. Categories
  const categories = await Category.insertMany([
    { name: 'Appetizers',        order: 1 },
    { name: 'Gourmet Pizzas',    order: 2 },
    { name: 'Signature Burgers', order: 3 },
    { name: 'Drinks & Mocktails',order: 4 },
    { name: 'Desserts',          order: 5 },
  ]);
  const [app, pizza, burger, drinks, desserts] = categories;
  console.log('📂 Categories seeded');

  // 2. Menu Items
  await Item.insertMany([
    {
      name: 'Truffle Parmesan Fries',
      description: 'Crispy golden fries tossed in white truffle oil, grated parmesan cheese, and fresh parsley, served with garlic aioli.',
      price: 320, category: app._id,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: true, isEgg: false, isSpicy: false,
    },
    {
      name: 'Fiery Jalapeno Poppers',
      description: 'Crispy breaded jalapenos stuffed with cream cheese and cheddar, served with sweet chili dipping sauce.',
      price: 280, category: app._id,
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: true, isEgg: false, isSpicy: true,
    },
    {
      name: 'Classic Margherita Pizza',
      description: 'San Marzano tomato sauce, fresh mozzarella balls, heirloom cherry tomatoes, fresh basil leaves, and EVOO drizzle.',
      price: 490, category: pizza._id,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: true, isEgg: false, isSpicy: false,
    },
    {
      name: 'Spicy Paneer Tikka Pizza',
      description: 'Tandoori marinated paneer, red onions, bell peppers, mozzarella, and spicy mint mayo drizzle.',
      price: 540, category: pizza._id,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: true, isEgg: false, isSpicy: true,
    },
    {
      name: 'Crispy Avocado Ranch Burger',
      description: 'Crispy veggie patty, fresh avocado slices, pickled onions, butter lettuce, and home-style ranch dressing.',
      price: 380, category: burger._id,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: true, isEgg: false, isSpicy: false,
    },
    {
      name: 'The Ultimate Egg-Meat Club',
      description: 'Double stacked grilled burger with fried farm egg, cheddar, caramelized onions, sweet pickles, and smoky BBQ sauce.',
      price: 420, category: burger._id,
      image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: false, isEgg: true, isSpicy: false,
    },
    {
      name: 'Fresh Mint & Lime Mojito',
      description: 'Crushed mint leaves, lime wedges, simple syrup, soda, and crushed ice, garnished with a fresh lime slice.',
      price: 180, category: drinks._id,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: true, isEgg: false, isSpicy: false,
    },
    {
      name: 'Chocolate Lava Fondant',
      description: 'Warm, gooey chocolate cake with a molten lava center, served with a scoop of vanilla bean ice cream.',
      price: 240, category: desserts._id,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
      isAvailable: true, isVeg: true, isEgg: false, isSpicy: false,
    },
  ]);
  console.log('🍕 Menu items seeded');

  // 3. Tables
  await Table.insertMany([
    { number: 'Table 1' },
    { number: 'Table 2' },
    { number: 'Table 3' },
    { number: 'Table 4' },
    { number: 'Table 5' },
    { number: 'Table 6' },
  ]);
  console.log('🪑 Tables seeded');

  // 4. Settings — update your phone number here
  await Settings.create({
    _id: 'default',
    restaurantName: 'BiteQR Cafe & Lounge',
    phoneNumber: '919876543210',   // ← change to your WhatsApp number
    currency: 'INR',
    currencySymbol: '₹',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=60',
    address: '456 Gourmet Boulevard, Foodie Plaza',
    taxRate: 5,
  });
  console.log('⚙️  Settings seeded');

  console.log('\n🎉 Demo data seeded successfully!');
  console.log('   Open your admin panel to see the data.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
