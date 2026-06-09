const mongoose = require('mongoose');
const { readData, writeData } = require('../data/jsonDb');
const { getDbMode } = require('../config/db');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const MongoCategory = mongoose.model('Category', CategorySchema);

const CategoryModel = {
  find: async () => {
    if (getDbMode() === 'mongodb') {
      return await MongoCategory.find().sort({ order: 1, name: 1 });
    } else {
      const categories = readData('categories');
      return categories.sort((a, b) => (a.order - b.order) || a.name.localeCompare(b.name));
    }
  },

  findById: async (id) => {
    if (getDbMode() === 'mongodb') {
      return await MongoCategory.findById(id);
    } else {
      const categories = readData('categories');
      return categories.find(c => c._id === id.toString()) || null;
    }
  },

  create: async (data) => {
    if (getDbMode() === 'mongodb') {
      const newCategory = new MongoCategory(data);
      return await newCategory.save();
    } else {
      const categories = readData('categories');
      const newCategory = {
        _id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        order: data.order !== undefined ? Number(data.order) : 0,
        createdAt: new Date().toISOString()
      };
      categories.push(newCategory);
      writeData('categories', categories);
      return newCategory;
    }
  },

  findByIdAndUpdate: async (id, data) => {
    if (getDbMode() === 'mongodb') {
      return await MongoCategory.findByIdAndUpdate(id, data, { new: true });
    } else {
      const categories = readData('categories');
      const index = categories.findIndex(c => c._id === id.toString());
      if (index === -1) return null;
      
      categories[index] = {
        ...categories[index],
        name: data.name !== undefined ? data.name : categories[index].name,
        order: data.order !== undefined ? Number(data.order) : categories[index].order
      };
      writeData('categories', categories);
      return categories[index];
    }
  },

  findByIdAndDelete: async (id) => {
    if (getDbMode() === 'mongodb') {
      return await MongoCategory.findByIdAndDelete(id);
    } else {
      const categories = readData('categories');
      const index = categories.findIndex(c => c._id === id.toString());
      if (index === -1) return null;
      const deleted = categories.splice(index, 1)[0];
      writeData('categories', categories);

      // Also clean up or adjust items that had this category
      const items = readData('items');
      const updatedItems = items.filter(item => item.category !== id.toString());
      writeData('items', updatedItems);

      return deleted;
    }
  }
};

module.exports = { CategoryModel, MongoCategory };
