const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  // Campos String
  name: {
    type: String,
    required: [true, 'El nombre de la región es obligatorio'],
    unique: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  
  // Campo Enumerado
  climate: {
    type: String,
    enum: {
      values: ['Templado', 'Frío', 'Cálido', 'Árido', 'Tropical'],
      message: '{VALUE} no es un clima válido'
    },
    default: 'Templado'
  },
  
  // Campos Number
  dangerLevel: {
    type: Number,
    default: 1,
    min: [1, 'El nivel de peligro mínimo es 1'],
    max: [10, 'El nivel de peligro máximo es 10']
  },
  
  population: {
    type: Number,
    default: 0,
    min: [0, 'La población no puede ser negativa']
  },
  
  // Campo Boolean
  isAccessible: {
    type: Boolean,
    default: true
  },
  
  // Fecha
  foundedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Region', regionSchema);
