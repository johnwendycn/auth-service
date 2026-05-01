const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Significant = sequelize.define('Significant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  icon_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  highlight_text: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'significants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Static methods - using the model name directly
Significant.getAll = async function(limit = 100, offset = 0) {
  const { rows } = await Significant.findAndCountAll({
    where: { is_active: true },
    limit,
    offset,
    order: [['priority', 'DESC'], ['created_at', 'DESC']],
    raw: true
  });
  return rows;
};

Significant.getById = async function(id) {
  return await Significant.findByPk(id, { raw: true });
};

Significant.getByPriority = async function(priority) {
  return await Significant.findAll({
    where: { priority, is_active: true },
    order: [['priority', 'DESC']],
    raw: true
  });
};

Significant.createSignificant = async function(data) {
  const significant = await Significant.create(data);
  return significant.toJSON();
};

Significant.updateSignificant = async function(id, updates) {
  const significant = await Significant.findByPk(id);
  if (!significant) return null;
  await significant.update(updates);
  return significant.toJSON();
};

Significant.deleteSignificant = async function(id) {
  const significant = await Significant.findByPk(id);
  if (!significant) return false;
  await significant.destroy();
  return true;
};

Significant.getCount = async function() {
  return await Significant.count({ where: { is_active: true } });
};

module.exports = Significant;