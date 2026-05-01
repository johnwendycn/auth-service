const Feature = require('../models/Feature.model');
const imageService = require('./image.service');

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

  async createFeature(data, imageFile = null) {
    const { title, description, thumbnail_url, category, order } = data;
    
    if (!title || !description) {
      throw new Error('Title and description are required');
    }
    
    // Handle image upload
    let image_url = data.image_url;
    if (imageFile) {
      image_url = imageService.getImageUrl(imageFile.filename);
    }
    
    if (!image_url) {
      throw new Error('Image URL or image file is required');
    }

    return Feature.create({
      title,
      description,
      image_url,
      thumbnail_url: thumbnail_url || null,
      category: category || null,
      order: order || 0,
      is_active: true
    });
  },

  async updateFeature(id, data, imageFile = null) {
    const feature = await Feature.findById(id);
    if (!feature) {
      throw new Error('Feature not found');
    }

    // Handle new image upload - delete old image if replacing
    if (imageFile) {
      // Delete old image if it exists in our img folder
      const oldFilename = imageService.getFilenameFromUrl(feature.image_url);
      if (oldFilename && !feature.image_url.startsWith('http')) {
        imageService.deleteImage(oldFilename);
      }
      data.image_url = imageService.getImageUrl(imageFile.filename);
    }

    return Feature.update(id, data);
  },

  async deleteFeature(id) {
    const feature = await Feature.findById(id);
    if (!feature) {
      throw new Error('Feature not found');
    }
    
    // Delete associated image if it exists in our img folder
    if (feature.image_url && !feature.image_url.startsWith('http')) {
      const filename = imageService.getFilenameFromUrl(feature.image_url);
      imageService.deleteImage(filename);
    }

    return Feature.delete(id);
  },

  async getFeatureCount() {
    return Feature.count();
  }
};