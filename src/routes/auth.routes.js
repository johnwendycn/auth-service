// ROUTES: endpoint + middleware wiring only.
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validate.middleware');

router.post('/register', validate(schemas.register), ctrl.register);
router.post('/login', validate(schemas.login), ctrl.login);
router.get('/verify-email/:token', ctrl.verifyEmail);
router.post('/forgot-password', validate(schemas.forgotPassword), ctrl.forgotPassword);
router.post('/reset-password/:token', validate(schemas.resetPassword), ctrl.resetPassword);
router.post('/refresh', validate(schemas.refresh), ctrl.refresh);

router.post('/logout', auth, ctrl.logout);

module.exports = router;
