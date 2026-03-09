const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
  // Campos String
  name: {
    type: String,
    required: [true, 'El nombre del arma es obligatorio'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  description: {
    type: String,
    default: 'Arma legendaria de la Tierra Media',
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  
  // Campo Enumerado
  type: {
    type: String,
    required: [true, 'El tipo de arma es obligatorio'],
    enum: {
      values: ['Espada', 'Arco', 'Hacha', 'Bastón', 'Daga', 'Lanza'],
      message: '{VALUE} no es un tipo de arma válido'
    }
  },
  
  // Campos Number
  damage: {
    type: Number,
    default: 10,
    min: [1, 'El daño mínimo es 1'],
    max: [100, 'El daño máximo es 100']
  },
  
  // Campo Boolean
  isMagical: {
    type: Boolean,
    default: false
  },
  
  // Fecha
  forgedDate: {
    type: Date,
    default: () => new Date('3000-01-01')
  },
  
  // Relación N:1 - Muchas armas pertenecen a un personaje
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Weapon', weaponSchema);
