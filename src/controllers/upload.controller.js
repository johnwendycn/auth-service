const imageService = require('../services/image.service');
const logger = require('../utils/logger');

module.exports = {
  // Single image upload
  uploadImage: (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { code: 'NO_FILE', message: 'No image file uploaded' }
        });
      }
      
      const imageUrl = imageService.getImageUrl(req.file.filename);
      
      res.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename: req.file.filename,
          url: imageUrl,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    } catch (error) {
      logger.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        error: { code: 'UPLOAD_ERROR', message: error.message }
      });
    }
  },
  
  // Multiple images upload
  uploadMultipleImages: (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'NO_FILES', message: 'No image files uploaded' }
        });
      }
      
      const images = req.files.map(file => ({
        filename: file.filename,
        url: imageService.getImageUrl(file.filename),
        size: file.size,
        mimetype: file.mimetype
      }));
      
      res.json({
        success: true,
        message: `${images.length} images uploaded successfully`,
        data: images
      });
    } catch (error) {
      logger.error('Error uploading images:', error);
      res.status(500).json({
        success: false,
        error: { code: 'UPLOAD_ERROR', message: error.message }
      });
    }
  },
  
  // Delete image
  deleteImage: (req, res) => {
    try {
      const { filename } = req.params;
      const deleted = imageService.deleteImage(filename);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Image not found' }
        });
      }
      
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting image:', error);
      res.status(500).json({
        success: false,
        error: { code: 'DELETE_ERROR', message: error.message }
      });
    }
  }
};