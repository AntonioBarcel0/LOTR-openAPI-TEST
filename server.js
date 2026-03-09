const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/lotr_db')

.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api/characters', require('./routes/characters'));
app.use('/api/weapons', require('./routes/weapons'));
app.use('/api/regions', require('./routes/regions'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de El Señor de los Anillos',
    endpoints: {
      characters: '/api/characters',
      weapons: '/api/weapons',
      regions: '/api/regions'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
