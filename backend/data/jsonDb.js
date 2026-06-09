const fs = require('fs');
const path = require('path');

const DATA_DIR = __dirname;

const files = {
  users: path.join(DATA_DIR, 'users.json'),
  categories: path.join(DATA_DIR, 'categories.json'),
  items: path.join(DATA_DIR, 'items.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
  tables: path.join(DATA_DIR, 'tables.json')
};

const SEED_CATEGORIES = [
  { _id: 'cat_1', name: 'Appetizers', order: 1 },
  { _id: 'cat_2', name: 'Gourmet Pizzas', order: 2 },
  { _id: 'cat_3', name: 'Signature Burgers', order: 3 },
  { _id: 'cat_4', name: 'Drinks & Mocktails', order: 4 },
  { _id: 'cat_5', name: 'Desserts', order: 5 }
];

const SEED_ITEMS = [
  {
    _id: 'item_1',
    name: 'Truffle Parmesan Fries',
    description: 'Crispy golden fries tossed in white truffle oil, grated parmesan cheese, and fresh parsley, served with garlic aioli.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80',
    category: 'cat_1',
    isAvailable: true,
    isVeg: true,
    isEgg: false,
    isSpicy: false
  },
  {
    _id: 'item_2',
    name: 'Fiery Jalapeno Poppers',
    description: 'Crispy breaded jalapenos stuffed with loaded cream cheese and cheddar, served with a sweet chili dipping sauce.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80',
    category: 'cat_1',
    isAvailable: true,
    isVeg: true,
    isEgg: false,
    isSpicy: true
  },
  {
    _id: 'item_3',
    name: 'Classic Margherita Pizza',
    description: 'San Marzano tomato sauce, fresh mozzarella balls, heirloom cherry tomatoes, fresh basil leaves, and a drizzle of extra virgin olive oil.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=80',
    category: 'cat_2',
    isAvailable: true,
    isVeg: true,
    isEgg: false,
    isSpicy: false
  },
  {
    _id: 'item_4',
    name: 'Spicy Paneer Tikka Pizza',
    description: 'Tandoori marinated paneer cubes, red onions, bell peppers, mozzarella, coriander, and spicy mint mayo drizzle.',
    price: 540,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    category: 'cat_2',
    isAvailable: true,
    isVeg: true,
    isEgg: false,
    isSpicy: true
  },
  {
    _id: 'item_5',
    name: 'Crispy Avocado Ranch Burger',
    description: 'Crispy vegetable and potato patty, layered with fresh avocado slices, pickled onions, butter lettuce, and home-style ranch dressing.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
    category: 'cat_3',
    isAvailable: true,
    isVeg: true,
    isEgg: false,
    isSpicy: false
  },
  {
    _id: 'item_6',
    name: 'The Ultimate Egg-Meat Club',
    description: 'Double stacked grilled burger with fried farm egg, cheddar cheese slice, caramelized onions, sweet pickles, and smoky BBQ sauce.',
    price: 420,
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&auto=format&fit=crop&q=80',
    category: 'cat_3',
    isAvailable: true,
    isVeg: false,
    isEgg: true,
    isSpicy: false
  },
  {
    _id: 'item_7',
    name: 'Fresh Mint & Lime Mojito',
    description: 'Crushed mint leaves, lime wedges, simple syrup, soda, and crushed ice, garnishing with a slice of fresh lime.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
    category: 'cat_4',
    isAvailable: true,
    isVeg: true,
    isEgg: false,
    isSpicy: false
  },
  {
    _id: 'item_8',
    name: 'Chocolate Lava Fondant',
    description: 'Warm, gooey chocolate cake with a molten lava chocolate center, served with a scoop of vanilla bean ice cream.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
    category: 'cat_5',
    isAvailable: true,
    isVeg: true,
    isEgg: false,
    isSpicy: false
  }
];

const SEED_TABLES = [
  { _id: 'table_1', number: 'Table 1' },
  { _id: 'table_2', number: 'Table 2' },
  { _id: 'table_3', number: 'Table 3' },
  { _id: 'table_4', number: 'Table 4' }
];

// Initialize JSON files if they don't exist
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  Object.entries(files).forEach(([key, filepath]) => {
    if (!fs.existsSync(filepath) || fs.readFileSync(filepath, 'utf8').trim() === '' || fs.readFileSync(filepath, 'utf8').trim() === '[]') {
      if (key === 'settings') {
        const defaultSettings = {
          _id: 'default',
          restaurantName: 'BiteQR Cafe & Lounge',
          phoneNumber: '919876543210',
          currency: 'INR',
          currencySymbol: '₹',
          logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          address: '456 Gourmet Boulevard, Foodie Plaza',
          taxRate: 5,
          createdAt: new Date().toISOString()
        };
        fs.writeFileSync(filepath, JSON.stringify(defaultSettings, null, 2));
      } else if (key === 'categories') {
        fs.writeFileSync(filepath, JSON.stringify(SEED_CATEGORIES, null, 2));
      } else if (key === 'items') {
        fs.writeFileSync(filepath, JSON.stringify(SEED_ITEMS, null, 2));
      } else if (key === 'tables') {
        fs.writeFileSync(filepath, JSON.stringify(SEED_TABLES, null, 2));
      } else {
        fs.writeFileSync(filepath, JSON.stringify([], null, 2));
      }
    }
  });
}

function readData(key) {
  initDb();
  try {
    const data = fs.readFileSync(files[key], 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${key} from JSON DB:`, err);
    return key === 'settings' ? {} : [];
  }
}

function writeData(key, data) {
  initDb();
  try {
    fs.writeFileSync(files[key], JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${key} to JSON DB:`, err);
    return false;
  }
}

module.exports = {
  readData,
  writeData,
  initDb
};
