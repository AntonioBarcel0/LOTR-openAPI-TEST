const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  // Campos String (2)
  name: {
    type: String,
    required: [true, 'El nombre del personaje es obligatorio'],
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    trim: true
  },
  title: {
    type: String,
    default: 'Sin título',
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  
  // Campo Enumerado (1)
  race: {
    type: String,
    required: [true, 'La raza es obligatoria'],
    enum: {
      values: ['Elfo', 'Humano', 'Enano', 'Hobbit', 'Maia', 'Orco', 'Ent'],
      message: '{VALUE} no es una raza válida'
    }
  },
  
  // Campos Number (2)
  age: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [1, 'La edad debe ser al menos 1'],
    max: [10000, 'La edad no puede exceder 10000 años']
  },
  powerLevel: {
    type: Number,
    default: 50,
    min: [1, 'El nivel de poder mínimo es 1'],
    max: [100, 'El nivel de poder máximo es 100']
  },
  
  // Campos Boolean (2)
  isAlive: {
    type: Boolean,
    default: true
  },
  hasRing: {
    type: Boolean,
    default: false
  },
  
  // Campos Date (2)
  birthDate: {
    type: Date,
    default: () => new Date('3000-01-01')
  },
  lastSeenDate: {
    type: Date,
    default: Date.now
  },
  
  // Relación 1:N - Un personaje tiene muchas armas
  weapons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Weapon'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Character', characterSchema);
