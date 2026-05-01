const Significant = require('../models/Significant.model');
const logger = require('../utils/logger');

module.exports = {
  // Get all significants
  async getAll(req, res) {
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
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Get significant by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID is a number
      const significantId = parseInt(id);
      if (isNaN(significantId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid significant ID'
        });
      }
      
      const significant = await Significant.getById(significantId);

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
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Get significants by priority
  async getByPriority(req, res) {
    try {
      const { priority } = req.params;
      
      // Validate priority is a number
      const priorityValue = parseInt(priority);
      if (isNaN(priorityValue)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid priority value. Must be a number.'
        });
      }
      
      const significants = await Significant.getByPriority(priorityValue);

      return res.json({
        success: true,
        data: significants,
        priority: priorityValue
      });
    } catch (error) {
      logger.error('Error fetching significants by priority:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Create significant (admin only)
  async create(req, res) {
    try {
      const { title, description, image_url, thumbnail_url, icon_url, highlight_text, priority } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }

      const significant = await Significant.createSignificant({
        title,
        description,
        image_url: image_url || null,
        thumbnail_url: thumbnail_url || null,
        icon_url: icon_url || null,
        highlight_text: highlight_text || null,
        priority: priority ? parseInt(priority) : 0,
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
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Update significant (admin only)
  async update(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID is a number
      const significantId = parseInt(id);
      if (isNaN(significantId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid significant ID'
        });
      }
      
      const updates = req.body;
      if (updates.priority !== undefined) {
        updates.priority = parseInt(updates.priority);
      }
      
      const significant = await Significant.updateSignificant(significantId, updates);

      if (!significant) {
        return res.status(404).json({
          success: false,
          message: 'Significant not found'
        });
      }

      logger.info(`Significant updated: ${significantId}`);
      return res.json({
        success: true,
        message: 'Significant updated successfully',
        data: significant
      });
    } catch (error) {
      logger.error('Error updating significant:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  },

  // Delete significant (admin only)
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Validate ID is a number
      const significantId = parseInt(id);
      if (isNaN(significantId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid significant ID'
        });
      }
      
      const deleted = await Significant.deleteSignificant(significantId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Significant not found'
        });
      }

      logger.info(`Significant deleted: ${significantId}`);
      return res.json({
        success: true,
        message: 'Significant deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting significant:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message }
      });
    }
  }
};