const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validate.middleware');

router.get('/me', auth, ctrl.me);
router.put('/me', auth, validate(schemas.updateMe), ctrl.updateMe);
router.post('/change-password', auth, validate(schemas.changePassword), ctrl.changePassword);

module.exports = router;
