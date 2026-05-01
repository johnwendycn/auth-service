// SERVICE: business logic for features
const Feature = require('../models/Feature.model');

module.exports = {
  async listFeatures(category = null, limit = 100, offset = 0) {
    if (category) {
      return Feature.findByCategory(category, limit, offset);
    }
    return Feature.findAll(limit, offset);
  },

  async getFeatureById(id) {
    return Feature.findById(id);
  },

  async createFeature(data) {
    const { title, description, image_url, thumbnail_url, category, order } = data;
    
    if (!title || !description || !image_url) {
      throw new Error('Title, description, and image_url are required');
    }

    return Feature.create({
      title,
      description,
      image_url,
      thumbnail_url,
      category,
      order: order || 0,
      is_active: true
    });
  },

  async updateFeature(id, data) {
    const feature = await Feature.findById(id);
    if (!feature) {
      throw new Error('Feature not found');
    }

    return Feature.update(id, data);
  },

  async deleteFeature(id) {
    const feature = await Feature.findById(id);
    if (!feature) {
      throw new Error('Feature not found');
    }

    return Feature.delete(id);
  },

  async getFeatureCount() {
    return Feature.count();
  }
};
