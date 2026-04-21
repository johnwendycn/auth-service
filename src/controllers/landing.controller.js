// CONTROLLER: renders the Compassionate Capitalism Endpoint landing page.
const pkg = require('../../package.json');
const cfg = require('../config/jwt');
const endpoints = require('../config/endpoints');

module.exports = {
  index(req, res) {
    res.render('index', {
      serviceName: 'Auth Service',
      version: pkg.version,
      issuer: cfg.issuer,
      baseUrl: `${req.protocol}://${req.get('host')}`,
      ...endpoints,
    });
  },
};
