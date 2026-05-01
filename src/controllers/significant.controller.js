const significantService = require('../services/significant.service');
const logger = require('../utils/logger');

module.exports = {
  async getAll(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      const priority = req.query.priority ? parseInt(req.query.priority) : null;
      
      const significants = await significantService.listSignificants(priority, limit, offset);
      const total = await significantService.getSignificantCount();

      return res.json({
        success: true,
        data: significants,
        pagination: { limit, offset, total }
      });
    } catch (error) {
      logger.error('Error fetching significants:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const significant = await significantService.getSignificantById(id);

      if (!significant) {
        return res.status(404).json({
          success: false,
          message: 'Significant not found'
        });
      }

      return res.json({
        success: true,
        data: significant
      });
    } catch (error) {
      logger.error('Error fetching significant:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async getByPriority(req, res, next) {
    try {
      const { priority } = req.params;
      const significants = await significantService.listSignificants(parseInt(priority));

      return res.json({
        success: true,
        data: significants,
        priority: parseInt(priority)
      });
    } catch (error) {
      logger.error('Error fetching significants by priority:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async create(req, res, next) {
    try {
      // Handle multiple file uploads
      let imageFile = null;
      let iconFile = null;
      
      if (req.files) {
        imageFile = req.files['image'] ? req.files['image'][0] : null;
        iconFile = req.files['icon'] ? req.files['icon'][0] : null;
      }
      
      const significant = await significantService.createSignificant(req.body, imageFile, iconFile);
      
      logger.info(`Significant created: ${significant.id}`);
      return res.status(201).json({
        success: true,
        message: 'Significant created successfully',
        data: significant
      });
    } catch (error) {
      logger.error('Error creating significant:', error);
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: error.message }
      });
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      
      // Handle multiple file uploads
      let imageFile = null;
      let iconFile = null;
      
      if (req.files) {
        imageFile = req.files['image'] ? req.files['image'][0] : null;
        iconFile = req.files['icon'] ? req.files['icon'][0] : null;
      }
      
      const significant = await significantService.updateSignificant(id, req.body, imageFile, iconFile);

      logger.info(`Significant updated: ${id}`);
      return res.json({
        success: true,
        message: 'Significant updated successfully',
        data: significant
      });
    } catch (error) {
      logger.error('Error updating significant:', error);
      res.status(400).json({
        success: false,
        error: { code: 'ERROR', message: error.message }
      });
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await significantService.deleteSignificant(id);

      logger.info(`Significant deleted: ${id}`);
      return res.json({
        success: true,
        message: 'Significant deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting significant:', error);
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: error.message }
      });
    }
  }
};