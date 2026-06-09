const express = require('express');
const router = express.Router();
const { CategoryModel } = require('../models/Category');
const { ensureAuthenticated } = require('../middleware/auth');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE category (Admin only)
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { name, order } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const category = await CategoryModel.create({ name, order });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE category (Admin only)
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { name, order } = req.body;
    const category = await CategoryModel.findByIdAndUpdate(req.params.id, { name, order });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE category (Admin only)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category and its related items deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
