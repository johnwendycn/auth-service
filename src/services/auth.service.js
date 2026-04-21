// SERVICE: business logic only. No req/res, no direct DB.
const crypto = require('crypto');
const UserModel = require('../models/User.model');
const RefreshTokenModel = require('../models/RefreshToken.model');
const tokenService = require('./token.service');
const emailService = require('./email.service');
const bcryptUtil = require('../utils/bcrypt');
const { BadRequest, Unauthorized, Conflict, NotFound } = require('../utils/errors');

const VERIFY_TTL_HOURS = 24;
const RESET_TTL_HOURS = 1;

function publicUser(u) {
  return {
    id: u.id, email: u.email, full_name: u.full_name,
    is_email_verified: !!u.is_email_verified, is_active: !!u.is_active,
    last_login_at: u.last_login_at, created_at: u.created_at,
  };
}

async function register({ email, password, full_name }) {
  const existing = await UserModel.findByEmail(email);
  if (existing) throw new Conflict('Email already registered');
  const password_hash = await bcryptUtil.hash(password);
  const verifyToken = crypto.randomBytes(32).toString('hex');
  const verifyExpires = new Date(Date.now() + VERIFY_TTL_HOURS * 3600 * 1000);
  const id = await UserModel.create({
    email, password_hash, full_name,
    email_verification_token: verifyToken,
    email_verification_expires: verifyExpires,
  });
  await emailService.sendVerificationEmail(email, verifyToken);
  const user = await UserModel.findById(id);
  return publicUser(user);
}

async function login({ email, password }) {
  const user = await UserModel.findByEmail(email);
  if (!user) throw new Unauthorized('Invalid credentials');
  if (!user.is_active) throw new Unauthorized('Account disabled');
  const ok = await bcryptUtil.compare(password, user.password_hash);
  if (!ok) throw new Unauthorized('Invalid credentials');
  const access = tokenService.generateAccessToken(user);
  const refresh = await tokenService.generateRefreshToken(user.id);
  await UserModel.update(user.id, { last_login_at: new Date() });
  return {
    user: publicUser(user),
    access_token: access.token,
    refresh_token: refresh.token,
    refresh_expires_at: refresh.expiresAt,
  };
}

async function logout({ decoded, refresh_token }) {
  await tokenService.blacklistAccessToken(decoded);
  if (refresh_token) await RefreshTokenModel.revoke(refresh_token);
}

async function refresh({ refresh_token }) {
  if (!refresh_token) throw new BadRequest('refresh_token required');
  const { userId, refresh } = await tokenService.rotateRefreshToken(refresh_token);
  const user = await UserModel.findById(userId);
  if (!user || !user.is_active) throw new Unauthorized('User inactive');
  const access = tokenService.generateAccessToken(user);
  return {
    access_token: access.token,
    refresh_token: refresh.token,
    refresh_expires_at: refresh.expiresAt,
  };
}

async function verifyEmail(token) {
  const user = await UserModel.findByVerificationToken(token);
  if (!user) throw new BadRequest('Invalid verification token');
  if (user.email_verification_expires && new Date(user.email_verification_expires) < new Date()) {
    throw new BadRequest('Verification token expired');
  }
  await UserModel.update(user.id, {
    is_email_verified: true,
    email_verification_token: null,
    email_verification_expires: null,
  });
  return { verified: true };
}

async function forgotPassword({ email }) {
  const user = await UserModel.findByEmail(email);
  // Always return success to avoid user enumeration.
  if (!user) return { sent: true };
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + RESET_TTL_HOURS * 3600 * 1000);
  await UserModel.update(user.id, {
    password_reset_token: token,
    password_reset_expires: expires,
  });
  await emailService.sendResetEmail(email, token);
  return { sent: true };
}

async function resetPassword({ token, new_password }) {
  const user = await UserModel.findByResetToken(token);
  if (!user) throw new BadRequest('Invalid reset token');
  if (!user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
    throw new BadRequest('Reset token expired');
  }
  const password_hash = await bcryptUtil.hash(new_password);
  await UserModel.update(user.id, {
    password_hash,
    password_reset_token: null,
    password_reset_expires: null,
  });
  await RefreshTokenModel.revokeAllForUser(user.id);
  return { reset: true };
}

module.exports = {
  register, login, logout, refresh,
  verifyEmail, forgotPassword, resetPassword,
  publicUser,
};
