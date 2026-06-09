const mongoose = require('mongoose');
const { readData, writeData } = require('../data/jsonDb');
const { getDbMode } = require('../config/db');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isAvailable: { type: Boolean, default: true },
  isVeg: { type: Boolean, default: false },
  isEgg: { type: Boolean, default: false },
  isSpicy: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MongoMenuItem = mongoose.model('MenuItem', MenuItemSchema);

const MenuItemModel = {
  find: async (filter = {}) => {
    if (getDbMode() === 'mongodb') {
      const query = {};
      if (filter.category) query.category = filter.category;
      if (filter.isAvailable !== undefined) query.isAvailable = filter.isAvailable;
      return await MongoMenuItem.find(query).populate('category');
    } else {
      const items = readData('items');
      const categories = readData('categories');
      
      let filtered = items;
      if (filter.category) {
        filtered = filtered.filter(item => item.category === filter.category.toString());
      }
      if (filter.isAvailable !== undefined) {
        filtered = filtered.filter(item => item.isAvailable === filter.isAvailable);
      }

      // Populate category
      return filtered.map(item => {
        const cat = categories.find(c => c._id === item.category);
        return {
          ...item,
          category: cat || { _id: item.category, name: 'Unknown' }
        };
      });
    }
  },

  findById: async (id) => {
    if (getDbMode() === 'mongodb') {
      return await MongoMenuItem.findById(id).populate('category');
    } else {
      const items = readData('items');
      const categories = readData('categories');
      const item = items.find(i => i._id === id.toString());
      if (!item) return null;

      const cat = categories.find(c => c._id === item.category);
      return {
        ...item,
        category: cat || { _id: item.category, name: 'Unknown' }
      };
    }
  },

  create: async (data) => {
    if (getDbMode() === 'mongodb') {
      const newItem = new MongoMenuItem(data);
      const saved = await newItem.save();
      return await MongoMenuItem.findById(saved._id).populate('category');
    } else {
      const items = readData('items');
      const categories = readData('categories');
      const newItem = {
        _id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        image: data.image || '',
        category: data.category.toString(),
        isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
        isVeg: data.isVeg !== undefined ? Boolean(data.isVeg) : false,
        isEgg: data.isEgg !== undefined ? Boolean(data.isEgg) : false,
        isSpicy: data.isSpicy !== undefined ? Boolean(data.isSpicy) : false,
        createdAt: new Date().toISOString()
      };
      items.push(newItem);
      writeData('items', items);

      const cat = categories.find(c => c._id === newItem.category);
      return {
        ...newItem,
        category: cat || { _id: newItem.category, name: 'Unknown' }
      };
    }
  },

  findByIdAndUpdate: async (id, data) => {
    if (getDbMode() === 'mongodb') {
      return await MongoMenuItem.findByIdAndUpdate(id, data, { new: true }).populate('category');
    } else {
      const items = readData('items');
      const categories = readData('categories');
      const index = items.findIndex(i => i._id === id.toString());
      if (index === -1) return null;

      items[index] = {
        ...items[index],
        name: data.name !== undefined ? data.name : items[index].name,
        description: data.description !== undefined ? data.description : items[index].description,
        price: data.price !== undefined ? Number(data.price) : items[index].price,
        image: data.image !== undefined ? data.image : items[index].image,
        category: data.category !== undefined ? data.category.toString() : items[index].category,
        isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : items[index].isAvailable,
        isVeg: data.isVeg !== undefined ? Boolean(data.isVeg) : items[index].isVeg,
        isEgg: data.isEgg !== undefined ? Boolean(data.isEgg) : items[index].isEgg,
        isSpicy: data.isSpicy !== undefined ? Boolean(data.isSpicy) : items[index].isSpicy
      };
      writeData('items', items);

      const cat = categories.find(c => c._id === items[index].category);
      return {
        ...items[index],
        category: cat || { _id: items[index].category, name: 'Unknown' }
      };
    }
  },

  findByIdAndDelete: async (id) => {
    if (getDbMode() === 'mongodb') {
      return await MongoMenuItem.findByIdAndDelete(id);
    } else {
      const items = readData('items');
      const index = items.findIndex(i => i._id === id.toString());
      if (index === -1) return null;
      const deleted = items.splice(index, 1)[0];
      writeData('items', items);
      return deleted;
    }
  }
};

module.exports = { MenuItemModel, MongoMenuItem };
