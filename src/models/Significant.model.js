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
    allowNull: true
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

// Static methods
Significant.getAll = async function(limit = 100, offset = 0) {
  const { rows } = await Significant.findAndCountAll({
    where: { is_active: true },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['priority', 'DESC'], ['created_at', 'DESC']],
    raw: true
  });
  return rows;
};

Significant.getById = async function(id) {
  const significantId = parseInt(id);
  if (isNaN(significantId)) return null;
  
  const significant = await Significant.findByPk(significantId, { raw: true });
  if (!significant) return null;
  return significant;
};

Significant.getByPriority = async function(priority) {
  const priorityValue = parseInt(priority);
  if (isNaN(priorityValue)) return [];
  
  const significants = await Significant.findAll({
    where: { priority: priorityValue, is_active: true },
    order: [['priority', 'DESC']],
    raw: true
  });
  return significants;
};

Significant.createSignificant = async function(data) {
  const significant = await Significant.create(data);
  return significant.toJSON();
};

Significant.updateSignificant = async function(id, updates) {
  const significantId = parseInt(id);
  if (isNaN(significantId)) return null;
  
  const significant = await Significant.findByPk(significantId);
  if (!significant) return null;
  await significant.update(updates);
  return significant.toJSON();
};

Significant.deleteSignificant = async function(id) {
  const significantId = parseInt(id);
  if (isNaN(significantId)) return false;
  
  const significant = await Significant.findByPk(significantId);
  if (!significant) return false;
  await significant.destroy();
  return true;
};

Significant.getCount = async function() {
  return await Significant.count({ where: { is_active: true } });
};

module.exports = Significant;