const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'keys');
fs.mkdirSync(dir, { recursive: true });

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

fs.writeFileSync(path.join(dir, 'private.pem'), privateKey, { mode: 0o600 });
fs.writeFileSync(path.join(dir, 'public.pem'), publicKey);
console.log('Wrote keys/private.pem and keys/public.pem');
