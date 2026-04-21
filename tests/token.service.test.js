jest.mock('../src/models/RefreshToken.model');
jest.mock('../src/models/Blacklist.model');

// Generate keys at runtime so the test does not depend on local key files.
const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const path = require('path');
const tmpDir = path.join(__dirname, '_keys');
fs.mkdirSync(tmpDir, { recursive: true });
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});
fs.writeFileSync(path.join(tmpDir, 'private.pem'), privateKey);
fs.writeFileSync(path.join(tmpDir, 'public.pem'), publicKey);
process.env.JWT_PRIVATE_KEY_PATH = path.join(tmpDir, 'private.pem');
process.env.JWT_PUBLIC_KEY_PATH = path.join(tmpDir, 'public.pem');
process.env.JWT_KID = 'test-key';
process.env.JWT_ISSUER = 'auth-service';
process.env.JWT_ACCESS_TTL = '5m';

const tokenService = require('../src/services/token.service');

describe('token.service', () => {
  test('access token is signed and verifiable', () => {
    const { token, jti } = tokenService.generateAccessToken({ id: 5, email: 'a@b.com', full_name: 'A' });
    const decoded = tokenService.verifyAccessToken(token);
    expect(decoded.sub).toBe('5');
    expect(decoded.email).toBe('a@b.com');
    expect(decoded.jti).toBe(jti);
  });

  test('verifyAccessToken throws on garbage', () => {
    expect(() => tokenService.verifyAccessToken('not-a-jwt')).toThrow('Invalid or expired token');
  });
});
