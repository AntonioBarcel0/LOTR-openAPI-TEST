const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DB_STATES = {
  0: 'desconectada',
  1: 'conectada',
  2: 'conectando',
  3: 'desconectando',
};

// GET /health - comprueba que la API responde y que la base de datos
// está accesible (lectura del estado de Mongoose + ping real).
router.get('/', async (req, res) => {
  const readyState = mongoose.connection.readyState;
  let dbHealthy = readyState === 1;

  if (dbHealthy) {
    try {
      await mongoose.connection.db.admin().ping();
    } catch {
      dbHealthy = false;
    }
  }

  const payload = {
    status: dbHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    api: 'ok',
    database: {
      status: DB_STATES[readyState] || 'desconocida',
      healthy: dbHealthy,
    },
  };

  res.status(dbHealthy ? 200 : 503).json(payload);
});

module.exports = router;
