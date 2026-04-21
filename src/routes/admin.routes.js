const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const adminKey = require('../middleware/admin.middleware');
const { validate, schemas } = require('../middleware/validate.middleware');

router.use(adminKey);
router.get('/users', ctrl.listUsers);
router.get('/users/:id', ctrl.getUser);
router.put('/users/:id/activate', validate(schemas.setActive), ctrl.setActive);
router.delete('/users/:id', ctrl.deleteUser);

module.exports = router;
