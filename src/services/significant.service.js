const Significant = require('../models/Significant.model');
const imageService = require('./image.service');

module.exports = {
  async listSignificants(priority = null, limit = 100, offset = 0) {
    if (priority !== null) {
      return Significant.findByPriority(priority);
    }
    return Significant.findAll(limit, offset);
  },

  async getSignificantById(id) {
    return Significant.findById(id);
  },

  async createSignificant(data, imageFile = null, iconFile = null) {
    const { title, description, thumbnail_url, icon_url, highlight_text, priority } = data;
    
    if (!title || !description) {
      throw new Error('Title and description are required');
    }
    
    // Handle main image upload
    let image_url = data.image_url;
    if (imageFile) {
      image_url = imageService.getImageUrl(imageFile.filename);
    }
    
    // Handle icon upload
    let finalIconUrl = icon_url;
    if (iconFile) {
      finalIconUrl = imageService.getImageUrl(iconFile.filename);
    }
    
    if (!image_url) {
      throw new Error('Image URL or image file is required');
    }

    return Significant.create({
      title,
      description,
      image_url,
      thumbnail_url: thumbnail_url || null,
      icon_url: finalIconUrl || null,
      highlight_text: highlight_text || null,
      priority: priority || 0,
      is_active: true
    });
  },

  async updateSignificant(id, data, imageFile = null, iconFile = null) {
    const significant = await Significant.findById(id);
    if (!significant) {
      throw new Error('Significant not found');
    }

    // Handle new main image upload - delete old image if replacing
    if (imageFile) {
      if (significant.image_url && !significant.image_url.startsWith('http')) {
        const oldFilename = imageService.getFilenameFromUrl(significant.image_url);
        imageService.deleteImage(oldFilename);
      }
      data.image_url = imageService.getImageUrl(imageFile.filename);
    }

    // Handle new icon upload - delete old icon if replacing
    if (iconFile) {
      if (significant.icon_url && !significant.icon_url.startsWith('http')) {
        const oldFilename = imageService.getFilenameFromUrl(significant.icon_url);
        imageService.deleteImage(oldFilename);
      }
      data.icon_url = imageService.getImageUrl(iconFile.filename);
    }

    return Significant.update(id, data);
  },

  async deleteSignificant(id) {
    const significant = await Significant.findById(id);
    if (!significant) {
      throw new Error('Significant not found');
    }
    
    // Delete associated main image if it exists in our img folder
    if (significant.image_url && !significant.image_url.startsWith('http')) {
      const filename = imageService.getFilenameFromUrl(significant.image_url);
      imageService.deleteImage(filename);
    }
    
    // Delete associated icon if it exists in our img folder
    if (significant.icon_url && !significant.icon_url.startsWith('http')) {
      const filename = imageService.getFilenameFromUrl(significant.icon_url);
      imageService.deleteImage(filename);
    }

    return Significant.delete(id);
  },

  async getSignificantCount() {
    return Significant.count();
  }
};