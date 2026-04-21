const crypto = require('crypto');
const cfg = require('../config/jwt');

let cached = null;
function buildJwks() {
  if (cached) return cached;
  const keyObj = crypto.createPublicKey(cfg.publicKey);
  const jwk = keyObj.export({ format: 'jwk' });
  cached = {
    keys: [{ ...jwk, use: 'sig', alg: 'RS256', kid: cfg.kid }],
  };
  return cached;
}

module.exports = {
  jwks(_req, res) {
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(buildJwks());
  },
};
