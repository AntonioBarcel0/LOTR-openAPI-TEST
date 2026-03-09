const express = require('express');
const router = express.Router();
const Region = require('../models/Region');

// CREATE
router.post('/', async (req, res) => {
  try {
    const region = new Region(req.body);
    await region.save();
    res.status(201).json(region);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Todas
router.get('/', async (req, res) => {
  try {
    const regions = await Region.find();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);
    if (!region) {
      return res.status(404).json({ error: 'Región no encontrada' });
    }
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const region = await Region.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!region) {
      return res.status(404).json({ error: 'Región no encontrada' });
    }
    res.json(region);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const region = await Region.findByIdAndDelete(req.params.id);
    if (!region) {
      return res.status(404).json({ error: 'Región no encontrada' });
    }
    res.json({ message: 'Región eliminada exitosamente', region });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
