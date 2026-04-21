// SERVICE: business logic only.
const UserModel = require('../models/User.model');
const RefreshTokenModel = require('../models/RefreshToken.model');
const bcryptUtil = require('../utils/bcrypt');
const { NotFound, BadRequest, Unauthorized } = require('../utils/errors');
const { publicUser } = require('./auth.service');

async function getProfile(userId) {
  const u = await UserModel.findById(userId);
  if (!u) throw new NotFound('User not found');
  return publicUser(u);
}

async function updateProfile(userId, { full_name }) {
  const u = await UserModel.findById(userId);
  if (!u) throw new NotFound('User not found');
  await UserModel.update(userId, { full_name });
  return publicUser({ ...u, full_name });
}

async function changePassword(userId, { current_password, new_password }) {
  const u = await UserModel.findById(userId);
  if (!u) throw new NotFound('User not found');
  const ok = await bcryptUtil.compare(current_password, u.password_hash);
  if (!ok) throw new Unauthorized('Current password is incorrect');
  if (current_password === new_password) throw new BadRequest('New password must differ');
  const password_hash = await bcryptUtil.hash(new_password);
  await UserModel.update(userId, { password_hash });
  await RefreshTokenModel.revokeAllForUser(userId);
  return { changed: true };
}

module.exports = { getProfile, updateProfile, changePassword };
