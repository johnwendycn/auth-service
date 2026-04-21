const { Forbidden } = require('../utils/errors');

module.exports = function adminMiddleware(req, _res, next) {
  const key = req.headers['x-admin-api-key'];
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return next(new Forbidden('Invalid admin API key'));
  }
  next();
};
