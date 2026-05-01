const Feature = require('../models/Feature.model');
const logger = require('../utils/logger');

module.exports = {
  // Get all features
  async getAll(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      
      const features = await Feature.getAll(limit, offset);
      const total = await Feature.getCount();

      return res.json({
        success: true,
        data: features,
        pagination: { limit, offset, total }
      });
    } catch (error) {
      logger.error('Error fetching features:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Get feature by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID is a number
      const featureId = parseInt(id);
      if (isNaN(featureId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid feature ID'
        });
      }
      
      const feature = await Feature.getById(featureId);

      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }

      return res.json({
        success: true,
        data: feature
      });
    } catch (error) {
      logger.error('Error fetching feature:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Get features by category
  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      const features = await Feature.getByCategory(category, limit, offset);

      return res.json({
        success: true,
        data: features,
        category
      });
    } catch (error) {
      logger.error('Error fetching features by category:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Create feature (admin only)
  async create(req, res) {
    try {
      const { title, description, image_url, thumbnail_url, category, order } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }

      const feature = await Feature.createFeature({
        title,
        description,
        image_url: image_url || null,
        thumbnail_url: thumbnail_url || null,
        category: category || null,
        order: order || 0,
        is_active: true
      });

      logger.info(`Feature created: ${feature.id}`);
      return res.status(201).json({
        success: true,
        message: 'Feature created successfully',
        data: feature
      });
    } catch (error) {
      logger.error('Error creating feature:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Update feature (admin only)
  async update(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID is a number
      const featureId = parseInt(id);
      if (isNaN(featureId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid feature ID'
        });
      }
      
      const updates = req.body;
      const feature = await Feature.updateFeature(featureId, updates);

      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }

      logger.info(`Feature updated: ${featureId}`);
      return res.json({
        success: true,
        message: 'Feature updated successfully',
        data: feature
      });
    } catch (error) {
      logger.error('Error updating feature:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Delete feature (admin only)
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID is a number
      const featureId = parseInt(id);
      if (isNaN(featureId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid feature ID'
        });
      }
      
      const deleted = await Feature.deleteFeature(featureId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }

      logger.info(`Feature deleted: ${featureId}`);
      return res.json({
        success: true,
        message: 'Feature deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting feature:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  }
};