const userService = require('../services/user.service');

module.exports = {
  async me(req, res, next) {
    try { res.json({ user: await userService.getProfile(req.user.id) }); }
    catch (e) { next(e); }
  },
  async updateMe(req, res, next) {
    try { res.json({ user: await userService.updateProfile(req.user.id, req.body) }); }
    catch (e) { next(e); }
  },
  async changePassword(req, res, next) {
    try { res.json(await userService.changePassword(req.user.id, req.body)); }
    catch (e) { next(e); }
  },
};
