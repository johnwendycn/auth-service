// CONTROLLER: handles HTTP requests/responses
const Feature = require('../models/Feature.model');
const logger = require('../utils/logger');

module.exports = {
  async getAll(req, res, next) {
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
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const feature = await Feature.getById(id);

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
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async getByCategory(req, res, next) {
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
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async create(req, res, next) {
    try {
      const { title, description, image_url, thumbnail_url, category, order } = req.body;

      if (!title || !description || !image_url) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and image_url are required'
        });
      }

      const feature = await Feature.createFeature({
        title,
        description,
        image_url,
        thumbnail_url,
        category,
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
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const feature = await Feature.updateFeature(id, updates);

      if (!feature) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }

      logger.info(`Feature updated: ${id}`);
      return res.json({
        success: true,
        message: 'Feature updated successfully',
        data: feature
      });
    } catch (error) {
      logger.error('Error updating feature:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const deleted = await Feature.deleteFeature(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Feature not found'
        });
      }

      logger.info(`Feature deleted: ${id}`);
      return res.json({
        success: true,
        message: 'Feature deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting feature:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  }
};