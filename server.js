require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { logger, requestLogger } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Conectado a MongoDB'))
  .catch(err => logger.error(`Error de conexión a MongoDB: ${err.message}`));

// Health check
app.use('/health', require('./routes/health'));

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/weapons', require('./routes/weapons'));
app.use('/api/regions', require('./routes/regions'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de El Señor de los Anillos',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      characters: '/api/characters',
      weapons: '/api/weapons',
      regions: '/api/regions'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.stack}`);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT}`);
});
