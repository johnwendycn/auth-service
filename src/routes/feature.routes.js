const router = require('express').Router();
const ctrl = require('../controllers/feature.controller');
const admin = require('../middleware/admin.middleware');

// Public routes - make sure all controller methods exist
router.get('/', ctrl.getAll);
router.get('/category/:category', ctrl.getByCategory);
router.get('/:id', ctrl.getById);

// Admin only routes
router.post('/', admin, ctrl.create);
router.put('/:id', admin, ctrl.update);
router.delete('/:id', admin, ctrl.delete);

module.exports = router;