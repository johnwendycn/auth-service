const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email_verification_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  password_reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_reset_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Static methods
User.createUser = async function(data) {
  return await this.create(data);
};

User.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

User.findById = async function(id) {
  return await this.findByPk(id);
};

User.findByVerificationToken = async function(token) {
  return await this.findOne({ where: { email_verification_token: token } });
};

User.findByResetToken = async function(token) {
  return await this.findOne({ where: { password_reset_token: token } });
};

User.updateUser = async function(id, fields) {
  await this.update(fields, { where: { id } });
  return await this.findByPk(id);
};

User.deleteUser = async function(id) {
  return await this.destroy({ where: { id } });
};

User.list = async function({ limit = 20, offset = 0 }) {
  const { rows, count } = await this.findAndCountAll({
    limit,
    offset,
    order: [['id', 'DESC']],
    attributes: ['id', 'email', 'full_name', 'is_email_verified', 'is_active', 'last_login_at', 'created_at']
  });
  return { rows, total: count };
};

User.count = async function() {
  return await this.count();
};

User.verifyEmail = async function(id) {
  await this.update(
    { is_email_verified: true, email_verification_token: null, email_verification_expires: null },
    { where: { id } }
  );
  return await this.findByPk(id);
};

User.setVerificationToken = async function(id, token, expires) {
  await this.update(
    { email_verification_token: token, email_verification_expires: expires },
    { where: { id } }
  );
};

User.setResetToken = async function(id, token, expires) {
  await this.update(
    { password_reset_token: token, password_reset_expires: expires },
    { where: { id } }
  );
};

User.clearResetToken = async function(id) {
  await this.update(
    { password_reset_token: null, password_reset_expires: null },
    { where: { id } }
  );
};

User.updatePassword = async function(id, hashedPassword) {
  await this.update(
    { password_hash: hashedPassword, password_reset_token: null, password_reset_expires: null },
    { where: { id } }
  );
};

User.updateLastLogin = async function(id) {
  await this.update(
    { last_login_at: new Date() },
    { where: { id } }
  );
};

User.emailExists = async function(email) {
  const count = await this.count({ where: { email } });
  return count > 0;
};

User.findByEmailWithPassword = async function(email) {
  return await this.findOne({ where: { email } });
};

module.exports = User;