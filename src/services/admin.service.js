// SERVICE: business logic only.
const UserModel = require('../models/User.model');
const RefreshTokenModel = require('../models/RefreshToken.model');
const { NotFound } = require('../utils/errors');
const { publicUser } = require('./auth.service');

async function listUsers({ page = 1, limit = 20 }) {
  page = Math.max(1, +page); limit = Math.min(100, Math.max(1, +limit));
  const offset = (page - 1) * limit;
  const { rows, total } = await UserModel.list({ limit, offset });
  return { page, limit, total, total_pages: Math.ceil(total / limit), users: rows };
}

async function getUser(id) {
  const u = await UserModel.findById(id);
  if (!u) throw new NotFound('User not found');
  return publicUser(u);
}

async function setActive(id, is_active) {
  const u = await UserModel.findById(id);
  if (!u) throw new NotFound('User not found');
  await UserModel.update(id, { is_active: !!is_active });
  if (!is_active) await RefreshTokenModel.revokeAllForUser(id);
  return { id, is_active: !!is_active };
}

async function deleteUser(id) {
  const u = await UserModel.findById(id);
  if (!u) throw new NotFound('User not found');
  await UserModel.delete(id);
  return { deleted: true };
}

module.exports = { listUsers, getUser, setActive, deleteUser };
