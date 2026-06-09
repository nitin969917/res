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

// UPDATE settings (Admin only, handles optional logo + hero uploads)
router.put('/', ensureAuthenticated, upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'heroFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { restaurantName, phoneNumber, currency, currencySymbol, address, taxRate, logoUrl, heroImageUrl, googleMapUrl } = req.body;

    const updateData = {};
    if (restaurantName !== undefined) updateData.restaurantName = restaurantName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (currency !== undefined) updateData.currency = currency;
    if (currencySymbol !== undefined) updateData.currencySymbol = currencySymbol;
    if (address !== undefined) updateData.address = address;
    if (taxRate !== undefined) updateData.taxRate = Number(taxRate);
    if (googleMapUrl !== undefined) updateData.googleMapUrl = googleMapUrl;

    // Logo: uploaded file takes priority over URL
    if (req.files && req.files['logoFile'] && req.files['logoFile'][0]) {
      const f = req.files['logoFile'][0];
      updateData.logoUrl = f.path || `/uploads/${f.filename}`;
    } else if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl;
    }

    // Hero image: uploaded file takes priority over URL
    if (req.files && req.files['heroFile'] && req.files['heroFile'][0]) {
      const f = req.files['heroFile'][0];
      updateData.heroImageUrl = f.path || `/uploads/${f.filename}`;
    } else if (heroImageUrl !== undefined) {
      updateData.heroImageUrl = heroImageUrl;
    }

    const settings = await SettingsModel.update(updateData);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
