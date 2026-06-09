const express = require('express');
const router = express.Router();
const { TableModel } = require('../models/Table');
const { ensureAuthenticated } = require('../middleware/auth');

// GET all tables (Public)
router.get('/', async (req, res) => {
  try {
    const tables = await TableModel.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE table (Admin only)
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) {
      return res.status(400).json({ error: 'Table number/name is required' });
    }
    const table = await TableModel.create({ number });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE table (Admin only)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const table = await TableModel.findByIdAndDelete(req.params.id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    res.json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
