const LEVEL_COLORS = {
  INFO: '\x1b[36m',
  WARN: '\x1b[33m',
  ERROR: '\x1b[31m',
};
const RESET = '\x1b[0m';

function write(level, message) {
  const color = LEVEL_COLORS[level] || '';
  const line = `${color}[${new Date().toISOString()}] [${level}]${RESET} ${message}`;
  if (level === 'ERROR') console.error(line);
  else console.log(line);
}

const logger = {
  info: (msg) => write('INFO', msg),
  warn: (msg) => write('WARN', msg),
  error: (msg) => write('ERROR', msg),
};

// Registra cada petición HTTP una vez que la respuesta ha terminado,
// incluyendo método, ruta, código de estado y duración.
function requestLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    write(level, `${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
}

module.exports = { logger, requestLogger };
