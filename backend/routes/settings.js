const express = require('express');
const router = express.Router();
const { SettingsModel } = require('../models/Settings');
const { ensureAuthenticated } = require('../middleware/auth');
const { upload } = require('../config/multer');

// GET settings (Public)
router.get('/', async (req, res) => {
  try {
    const settings = await SettingsModel.get();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE settings (Admin only, handles optional logo upload)
router.put('/', ensureAuthenticated, upload.single('logoFile'), async (req, res) => {
  try {
    const { restaurantName, phoneNumber, currency, currencySymbol, address, taxRate, logoUrl } = req.body;
    
    const updateData = {};
    if (restaurantName !== undefined) updateData.restaurantName = restaurantName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (currency !== undefined) updateData.currency = currency;
    if (currencySymbol !== undefined) updateData.currencySymbol = currencySymbol;
    if (address !== undefined) updateData.address = address;
    if (taxRate !== undefined) updateData.taxRate = Number(taxRate);
    
    if (req.file) {
      updateData.logoUrl = req.file.path ? req.file.path : `/uploads/${req.file.filename}`;
    } else if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl;
    }

    const settings = await SettingsModel.update(updateData);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
