const mongoose = require('mongoose');
const { readData, writeData } = require('../data/jsonDb');
const { getDbMode } = require('../config/db');

const TableSchema = new mongoose.Schema({
  number: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoTable = mongoose.model('Table', TableSchema);

const TableModel = {
  find: async () => {
    if (getDbMode() === 'mongodb') {
      return await MongoTable.find().sort({ number: 1 });
    } else {
      const tables = readData('tables');
      // Sort tables by parsing the number value if possible
      return tables.sort((a, b) => {
        const numA = parseInt(a.number.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.number.replace(/\D/g, '')) || 0;
        if (numA !== numB) return numA - numB;
        return a.number.localeCompare(b.number);
      });
    }
  },

  findById: async (id) => {
    if (getDbMode() === 'mongodb') {
      return await MongoTable.findById(id);
    } else {
      const tables = readData('tables');
      return tables.find(t => t._id === id.toString()) || null;
    }
  },

  create: async (data) => {
    if (getDbMode() === 'mongodb') {
      const newTable = new MongoTable(data);
      return await newTable.save();
    } else {
      const tables = readData('tables');
      const newTable = {
        _id: Math.random().toString(36).substr(2, 9),
        number: data.number.toString(),
        createdAt: new Date().toISOString()
      };
      tables.push(newTable);
      writeData('tables', tables);
      return newTable;
    }
  },

  findByIdAndDelete: async (id) => {
    if (getDbMode() === 'mongodb') {
      return await MongoTable.findByIdAndDelete(id);
    } else {
      const tables = readData('tables');
      const index = tables.findIndex(t => t._id === id.toString());
      if (index === -1) return null;
      const deleted = tables.splice(index, 1)[0];
      writeData('tables', tables);
      return deleted;
    }
  }
};

module.exports = { TableModel, MongoTable };
