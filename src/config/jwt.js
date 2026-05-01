const fs = require('fs');
const path = require('path');
require('dotenv').config();

function readKey(filePath) {
  // Convert relative path to absolute if needed
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(abs)) {
    throw new Error(`JWT key not found at ${abs}`);
  }
  return fs.readFileSync(abs, 'utf8');
}

// Determine which keys to use
let privateKey, publicKey;

// Priority 1: Direct environment variables (Render production)
if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY) {
  privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');
  publicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
  console.log('✅ Using JWT keys from environment variables (Render mode)');
} 
// Priority 2: File paths (local development)
else {
  try {
    // Try multiple possible local paths
    const possiblePaths = [
      'src/keys/private.pem',
      'keys/private.pem',
      './src/keys/private.pem',
      './keys/private.pem'
    ];
    
    let privateKeyPath = null;
    let publicKeyPath = null;
    
    // Find existing key files
    for (const p of possiblePaths) {
      const fullPath = path.join(process.cwd(), p);
      if (fs.existsSync(fullPath)) {
        privateKeyPath = fullPath;
        publicKeyPath = fullPath.replace('private.pem', 'public.pem');
        break;
      }
    }
    
    if (!privateKeyPath || !fs.existsSync(publicKeyPath)) {
      throw new Error(`Key files not found. Looked in: ${possiblePaths.join(', ')}`);
    }
    
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    console.log(`✅ Using JWT keys from files: ${privateKeyPath}`);
  } catch (error) {
    console.error('❌ JWT keys missing!');
    console.error('   For local: Run npm run keys:generate');
    console.error('   For Render: Set JWT_PRIVATE_KEY and JWT_PUBLIC_KEY in environment variables');
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// Validate keys exist
if (!privateKey || !publicKey) {
  console.error('❌ JWT keys validation failed!');
  process.exit(1);
}

module.exports = {
  privateKey,
  publicKey,
  kid: process.env.JWT_KID || 'auth-key-1',
  issuer: process.env.JWT_ISSUER || 'auth-service',
  algorithm: 'RS256',
  accessTokenExpiry: process.env.JWT_ACCESS_TTL || '15m',
  refreshTokenExpiry: process.env.JWT_REFRESH_TTL_DAYS ? `${process.env.JWT_REFRESH_TTL_DAYS}d` : '30d'
};