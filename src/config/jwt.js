const fs = require('fs');
const path = require('path');
require('dotenv').config();

function readKey(envPath, fallback) {
  const p = envPath || fallback;
  const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  if (!fs.existsSync(abs)) {
    throw new Error(`JWT key not found at ${abs}. Run: npm run keys:generate`);
  }
  return fs.readFileSync(abs, 'utf8');
}

module.exports = {
  privateKey: readKey(process.env.JWT_PRIVATE_KEY_PATH, './keys/private.pem'),
  publicKey: readKey(process.env.JWT_PUBLIC_KEY_PATH, './keys/public.pem'),
  kid: process.env.JWT_KID || 'auth-key-1',
  issuer: process.env.JWT_ISSUER || 'auth-service',
  algorithm: 'RS256',
  accessTtl: process.env.JWT_ACCESS_TTL || '15m',
  refreshTtlDays: +process.env.JWT_REFRESH_TTL_DAYS || 30,
};
