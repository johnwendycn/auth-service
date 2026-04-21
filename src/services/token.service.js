// SERVICE: business logic only. No req/res, no direct DB.
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const cfg = require('../config/jwt');
const RefreshTokenModel = require('../models/RefreshToken.model');
const BlacklistModel = require('../models/Blacklist.model');
const { Unauthorized } = require('../utils/errors');

function generateAccessToken(user) {
  const jti = uuidv4();
  const token = jwt.sign(
    { sub: String(user.id), email: user.email, name: user.full_name },
    cfg.privateKey,
    {
      algorithm: cfg.algorithm,
      expiresIn: cfg.accessTtl,
      issuer: cfg.issuer,
      jwtid: jti,
      header: { kid: cfg.kid, alg: cfg.algorithm },
    }
  );
  return { token, jti };
}

async function generateRefreshToken(userId) {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + cfg.refreshTtlDays * 24 * 60 * 60 * 1000);
  await RefreshTokenModel.create({ user_id: userId, token, expires_at: expiresAt });
  return { token, expiresAt };
}

function verifyAccessToken(token) {
  try {
    return jwt.verify(token, cfg.publicKey, { algorithms: [cfg.algorithm], issuer: cfg.issuer });
  } catch (e) {
    throw new Unauthorized('Invalid or expired token');
  }
}

async function rotateRefreshToken(oldToken) {
  const row = await RefreshTokenModel.findByToken(oldToken);
  if (!row) throw new Unauthorized('Invalid refresh token');
  if (row.revoked_at) throw new Unauthorized('Refresh token revoked');
  if (new Date(row.expires_at) < new Date()) throw new Unauthorized('Refresh token expired');
  await RefreshTokenModel.revoke(oldToken);
  const fresh = await generateRefreshToken(row.user_id);
  return { userId: row.user_id, refresh: fresh };
}

async function blacklistAccessToken(decoded) {
  if (!decoded?.jti || !decoded?.exp) return;
  await BlacklistModel.add({ jti: decoded.jti, expires_at: new Date(decoded.exp * 1000) });
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  rotateRefreshToken,
  blacklistAccessToken,
};
