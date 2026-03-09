const express = require('express');
const router = express.Router();
const Weapon = require('../models/Weapon');

// CREATE
router.post('/', async (req, res) => {
  try {
    const weapon = new Weapon(req.body);
    await weapon.save();
    res.status(201).json(weapon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Todas
router.get('/', async (req, res) => {
  try {
    const weapons = await Weapon.find().populate('owner');
    res.json(weapons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Por ID
router.get('/:id', async (req, res) => {
  try {
    const weapon = await Weapon.findById(req.params.id).populate('owner');
    if (!weapon) {
      return res.status(404).json({ error: 'Arma no encontrada' });
    }
    res.json(weapon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const weapon = await Weapon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner');
    
    if (!weapon) {
      return res.status(404).json({ error: 'Arma no encontrada' });
    }
    res.json(weapon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const weapon = await Weapon.findByIdAndDelete(req.params.id);
    if (!weapon) {
      return res.status(404).json({ error: 'Arma no encontrada' });
    }
    res.json({ message: 'Arma eliminada exitosamente', weapon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
