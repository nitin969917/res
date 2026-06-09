const mongoose = require('mongoose');
const { readData, writeData } = require('../data/jsonDb');
const { getDbMode } = require('../config/db');

const SettingsSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true, default: 'My Restaurant' },
  phoneNumber: { type: String, required: true, default: '1234567890' },
  currency: { type: String, default: 'USD' },
  currencySymbol: { type: String, default: '$' },
  logoUrl: { type: String, default: '' },
  address: { type: String, default: '' },
  taxRate: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

const MongoSettings = mongoose.model('Settings', SettingsSchema);

const SettingsModel = {
  get: async () => {
    if (getDbMode() === 'mongodb') {
      let settings = await MongoSettings.findOne();
      if (!settings) {
        settings = new MongoSettings({
          restaurantName: 'BiteQR Cafe & Lounge',
          phoneNumber: '919876543210',
          currency: 'INR',
          currencySymbol: '₹',
          logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          address: '456 Gourmet Boulevard, Foodie Plaza',
          taxRate: 5
        });
        await settings.save();
      }
      return settings;
    } else {
      return readData('settings');
    }
  },

  update: async (data) => {
    if (getDbMode() === 'mongodb') {
      let settings = await MongoSettings.findOne();
      if (!settings) {
        settings = new MongoSettings(data);
      } else {
        Object.assign(settings, data);
        settings.updatedAt = Date.now();
      }
      return await settings.save();
    } else {
      const current = readData('settings');
      const updated = {
        ...current,
        ...data,
        updatedAt: new Date().toISOString()
      };
      writeData('settings', updated);
      return updated;
    }
  }
};

module.exports = { SettingsModel, MongoSettings };
