// SERVICE: business logic for significants
const Significant = require('../models/Significant.model');

module.exports = {
  async listSignificants(priority = null, limit = 100, offset = 0) {
    if (priority !== null && priority !== undefined) {
      return Significant.findByPriority(priority);
    }
    return Significant.findAll(limit, offset);
  },

  async getSignificantById(id) {
    return Significant.findById(id);
  },

  async createSignificant(data) {
    const { title, description, image_url, thumbnail_url, icon_url, highlight_text, priority } = data;
    
    if (!title || !description || !image_url) {
      throw new Error('Title, description, and image_url are required');
    }

    return Significant.create({
      title,
      description,
      image_url,
      thumbnail_url,
      icon_url,
      highlight_text,
      priority: priority || 0,
      is_active: true
    });
  },

  async updateSignificant(id, data) {
    const significant = await Significant.findById(id);
    if (!significant) {
      throw new Error('Significant not found');
    }

    return Significant.update(id, data);
  },

  async deleteSignificant(id) {
    const significant = await Significant.findById(id);
    if (!significant) {
      throw new Error('Significant not found');
    }

    return Significant.delete(id);
  },

  async getSignificantCount() {
    return Significant.count();
  }
};
