// CONTROLLER: req/res only. No business logic.
const authService = require('../services/auth.service');

module.exports = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ user });
    } catch (e) { next(e); }
  },

  async login(req, res, next) {
    try {
      const data = await authService.login(req.body);
      res.json(data);
    } catch (e) { next(e); }
  },

  async logout(req, res, next) {
    try {
      await authService.logout({
        decoded: req.token.decoded,
        refresh_token: req.body?.refresh_token,
      });
      res.json({ logged_out: true });
    } catch (e) { next(e); }
  },

  async refresh(req, res, next) {
    try {
      const data = await authService.refresh({ refresh_token: req.body.refresh_token });
      res.json(data);
    } catch (e) { next(e); }
  },

  async verifyEmail(req, res, next) {
    try {
      const data = await authService.verifyEmail(req.params.token);
      res.json(data);
    } catch (e) { next(e); }
  },

  async forgotPassword(req, res, next) {
    try {
      const data = await authService.forgotPassword(req.body);
      res.json(data);
    } catch (e) { next(e); }
  },

  async resetPassword(req, res, next) {
    try {
      const data = await authService.resetPassword({
        token: req.params.token,
        new_password: req.body.new_password,
      });
      res.json(data);
    } catch (e) { next(e); }
  },
};
