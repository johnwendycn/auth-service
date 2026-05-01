const router = require('express').Router();
const ctrl = require('../controllers/significant.controller');
const admin = require('../middleware/admin.middleware');
const imageService = require('../services/image.service');

// Configure multer for multiple file uploads
const uploadFields = imageService.upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'icon', maxCount: 1 }
]);

// Public routes
router.get('/', ctrl.getAll);
router.get('/priority/:priority', ctrl.getByPriority);
router.get('/:id', ctrl.getById);

// Admin only routes with image upload support
router.post('/', admin, uploadFields, ctrl.create);
router.put('/:id', admin, uploadFields, ctrl.update);
router.delete('/:id', admin, ctrl.delete);

module.exports = router;