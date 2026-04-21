const tokenService = require('../services/token.service');
const BlacklistModel = require('../models/Blacklist.model');
const UserModel = require('../models/User.model');
const { Unauthorized } = require('../utils/errors');

module.exports = async function authMiddleware(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw new Unauthorized('Missing bearer token');
    const decoded = tokenService.verifyAccessToken(token);
    if (decoded.jti && await BlacklistModel.isBlacklisted(decoded.jti)) {
      throw new Unauthorized('Token revoked');
    }
    const user = await UserModel.findById(+decoded.sub);
    if (!user || !user.is_active) throw new Unauthorized('User inactive');
    req.user = user;
    req.token = { decoded, raw: token };
    next();
  } catch (e) { next(e); }
};
