const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Feature = sequelize.define('Feature', {
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
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'order_index'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'features',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Static methods
Feature.getAll = async function(limit = 100, offset = 0) {
  const { rows } = await Feature.findAndCountAll({
    where: { is_active: true },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['order', 'ASC'], ['created_at', 'DESC']],
    raw: true
  });
  
  return rows.map(feature => ({
    ...feature,
    order: feature.order
  }));
};

Feature.getById = async function(id) {
  // Ensure id is a number
  const featureId = parseInt(id);
  if (isNaN(featureId)) return null;
  
  const feature = await Feature.findByPk(featureId, { raw: true });
  if (!feature) return null;
  return feature;
};

Feature.getByCategory = async function(category, limit = 100, offset = 0) {
  const features = await Feature.findAll({
    where: { category, is_active: true },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['order', 'ASC']],
    raw: true
  });
  return features;
};

Feature.createFeature = async function(data) {
  const feature = await Feature.create(data);
  return feature.toJSON();
};

Feature.updateFeature = async function(id, updates) {
  const featureId = parseInt(id);
  if (isNaN(featureId)) return null;
  
  const feature = await Feature.findByPk(featureId);
  if (!feature) return null;
  await feature.update(updates);
  return feature.toJSON();
};

Feature.deleteFeature = async function(id) {
  const featureId = parseInt(id);
  if (isNaN(featureId)) return false;
  
  const feature = await Feature.findByPk(featureId);
  if (!feature) return false;
  await feature.destroy();
  return true;
};

Feature.getCount = async function() {
  return await Feature.count({ where: { is_active: true } });
};

module.exports = Feature;