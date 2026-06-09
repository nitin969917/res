const express = require('express');
const router = express.Router();
const { MenuItemModel } = require('../models/MenuItem');
const { upload } = require('../config/multer');
const { ensureAuthenticated } = require('../middleware/auth');

// GET all items (optional category filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.isAvailable) {
      filter.isAvailable = req.query.isAvailable === 'true';
    }
    const items = await MenuItemModel.find(filter);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single item
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE menu item (Admin only, handles file upload)
router.post('/', ensureAuthenticated, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, isVeg, isEgg, isSpicy, image } = req.body;
    
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    let imageUrl = image || '';
    if (req.file) {
      // If Cloudinary is used, path is the Cloudinary URL.
      // If diskStorage is used, filename is the local filename.
      imageUrl = req.file.path ? req.file.path : `/uploads/${req.file.filename}`;
    }

    const item = await MenuItemModel.create({
      name,
      description,
      price: Number(price),
      category,
      image: imageUrl,
      isAvailable: isAvailable === 'true' || isAvailable === true,
      isVeg: isVeg === 'true' || isVeg === true,
      isEgg: isEgg === 'true' || isEgg === true,
      isSpicy: isSpicy === 'true' || isSpicy === true
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE menu item (Admin only, handles file upload)
router.put('/:id', ensureAuthenticated, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, isVeg, isEgg, isSpicy, image } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable === 'true' || isAvailable === true;
    if (isVeg !== undefined) updateData.isVeg = isVeg === 'true' || isVeg === true;
    if (isEgg !== undefined) updateData.isEgg = isEgg === 'true' || isEgg === true;
    if (isSpicy !== undefined) updateData.isSpicy = isSpicy === 'true' || isSpicy === true;
    
    if (req.file) {
      updateData.image = req.file.path ? req.file.path : `/uploads/${req.file.filename}`;
    } else if (image !== undefined) {
      updateData.image = image;
    }

    const item = await MenuItemModel.findByIdAndUpdate(req.params.id, updateData);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE menu item (Admin only)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const item = await MenuItemModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
