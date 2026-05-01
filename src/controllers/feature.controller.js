const featureService = require('../services/feature.service');
const logger = require('../utils/logger');

module.exports = {
  async getAll(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const category = req.query.category;
      
      const features = await featureService.listFeatures(category, limit, offset);
      const total = await featureService.getFeatureCount();

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
      const feature = await featureService.getFeatureById(id);

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

  async create(req, res, next) {
    try {
      const feature = await featureService.createFeature(req.body, req.file);
      
      logger.info(`Feature created: ${feature.id}`);
      return res.status(201).json({
        success: true,
        message: 'Feature created successfully',
        data: feature
      });
    } catch (error) {
      logger.error('Error creating feature:', error);
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.message }
      });
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const feature = await featureService.updateFeature(id, req.body, req.file);

      logger.info(`Feature updated: ${id}`);
      return res.json({
        success: true,
        message: 'Feature updated successfully',
        data: feature
      });
    } catch (error) {
      logger.error('Error updating feature:', error);
      res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message }
      });
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await featureService.deleteFeature(id);

      logger.info(`Feature deleted: ${id}`);
      return res.json({
        success: true,
        message: 'Feature deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting feature:', error);
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: error.message }
      });
    }
  }
};