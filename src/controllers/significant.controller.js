// CONTROLLER: handles HTTP requests/responses
const Significant = require('../models/Significant.model');
const logger = require('../utils/logger');

module.exports = {
  async getAll(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      
      const significants = await Significant.getAll(limit, offset);
      const total = await Significant.getCount();

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
      const significant = await Significant.getById(id);

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
      const significants = await Significant.getByPriority(parseInt(priority));

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
      const { title, description, image_url, thumbnail_url, icon_url, highlight_text, priority } = req.body;

      if (!title || !description || !image_url) {
        return res.status(400).json({
          success: false,
          message: 'Title, description, and image_url are required'
        });
      }

      const significant = await Significant.createSignificant({
        title,
        description,
        image_url,
        thumbnail_url,
        icon_url,
        highlight_text,
        priority: priority || 0,
        is_active: true
      });

      logger.info(`Significant created: ${significant.id}`);
      return res.status(201).json({
        success: true,
        message: 'Significant created successfully',
        data: significant
      });
    } catch (error) {
      logger.error('Error creating significant:', error);
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

      const significant = await Significant.updateSignificant(id, updates);

      if (!significant) {
        return res.status(404).json({
          success: false,
          message: 'Significant not found'
        });
      }

      logger.info(`Significant updated: ${id}`);
      return res.json({
        success: true,
        message: 'Significant updated successfully',
        data: significant
      });
    } catch (error) {
      logger.error('Error updating significant:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const deleted = await Significant.deleteSignificant(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Significant not found'
        });
      }

      logger.info(`Significant deleted: ${id}`);
      return res.json({
        success: true,
        message: 'Significant deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting significant:', error);
      res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  }
};