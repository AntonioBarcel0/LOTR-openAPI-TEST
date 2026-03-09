const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// CREATE - Crear personaje
router.post('/', async (req, res) => {
  try {
    const character = new Character(req.body);
    await character.save();
    res.status(201).json(character);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Obtener todos los personajes (con populate)
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find().populate('weapons');
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Obtener un personaje por ID
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate('weapons');
    if (!character) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Actualizar personaje
router.put('/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('weapons');
    
    if (!character) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    res.json(character);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Eliminar personaje
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    res.json({ message: 'Personaje eliminado exitosamente', character });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EXTRA - Agregar arma a personaje
router.post('/:id/weapons/:weaponId', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    
    character.weapons.push(req.params.weaponId);
    await character.save();
    await character.populate('weapons');
    
    res.json(character);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
