const adminService = require('../services/admin.service');

module.exports = {
  async listUsers(req, res, next) {
    try { res.json(await adminService.listUsers(req.query)); } catch (e) { next(e); }
  },
  async getUser(req, res, next) {
    try { res.json({ user: await adminService.getUser(+req.params.id) }); } catch (e) { next(e); }
  },
  async setActive(req, res, next) {
    try { res.json(await adminService.setActive(+req.params.id, req.body.is_active)); } catch (e) { next(e); }
  },
  async deleteUser(req, res, next) {
    try { res.json(await adminService.deleteUser(+req.params.id)); } catch (e) { next(e); }
  },
};
