const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

// 404
function notFound(_req, res, _next) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
}

// Centralized error handler
function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
  }
  logger.error('unhandled.error', { err: err.message, stack: err.stack, url: req.originalUrl });
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
}

module.exports = { notFound, errorHandler };
