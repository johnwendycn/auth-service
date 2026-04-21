const fs = require('fs');
const path = require('path');
require('dotenv').config();

function readKey(envPath, fallback) {
  // First, try to get from environment variable (Render)
  if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY) {
    // Already have keys in env vars (Render deployment)
    return null; // Will be handled below
  }
  
  // Otherwise, read from file (local development)
  const p = envPath || fallback;
  const abs = path.isAbsolute(p) ? p : path.join(process.cwd(), p);
  if (!fs.existsSync(abs)) {
    throw new Error(`JWT key not found at ${abs}. Run: npm run keys:generate`);
  }
  return fs.readFileSync(abs, 'utf8');
}

// Determine which keys to use
let privateKey, publicKey;

// Priority 1: Direct environment variables (Render production)
if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY) {
  privateKey = process.env.JWT_PRIVATE_KEY;
  publicKey = process.env.JWT_PUBLIC_KEY;
  console.log('✅ Using JWT keys from environment variables (Render mode)');
} 
// Priority 2: File paths (local development)
else {
  privateKey = readKey(process.env.JWT_PRIVATE_KEY_PATH, './keys/private.pem');
  publicKey = readKey(process.env.JWT_PUBLIC_KEY_PATH, './keys/public.pem');
  console.log('✅ Using JWT keys from files (Local development mode)');
}

// Validate keys exist
if (!privateKey || !publicKey) {
  console.error('❌ JWT keys missing!');
  console.error('   For local: Run npm run keys:generate');
  console.error('   For Render: Set JWT_PRIVATE_KEY and JWT_PUBLIC_KEY in environment variables');
  process.exit(1);
}

module.exports = {
  privateKey,
  publicKey,
  kid: process.env.JWT_KID || 'auth-key-1',
  issuer: process.env.JWT_ISSUER || 'auth-service',
  algorithm: 'RS256',
  accessTtl: process.env.JWT_ACCESS_TTL || '15m',
  refreshTtlDays: +process.env.JWT_REFRESH_TTL_DAYS || 30,
};