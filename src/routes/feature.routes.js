const router = require('express').Router();
const ctrl = require('../controllers/feature.controller');
const admin = require('../middleware/admin.middleware');
const imageService = require('../services/image.service');

// Public routes
router.get('/', ctrl.getAll);
router.get('/category/:category', ctrl.getByCategory);
router.get('/:id', ctrl.getById);

// Admin only routes with image upload
router.post('/', admin, imageService.upload.single('image'), ctrl.create);
router.put('/:id', admin, imageService.upload.single('image'), ctrl.update);
router.delete('/:id', admin, ctrl.delete);

module.exports = router;