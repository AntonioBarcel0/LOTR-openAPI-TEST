const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.slice(7);

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireRole(...roles) {
  return [
    authenticate,
    (req, res, next) => {
      const hasRole = roles.some(role => req.user.roles.includes(role));
      if (!hasRole) {
        return res.status(403).json({
          error: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}`
        });
      }
      next();
    }
  ];
}

module.exports = { authenticate, requireRole };
