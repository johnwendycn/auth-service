// Endpoint metadata used by the EJS landing page (Compassionate Capitalism Endpoint).
module.exports = {
  publicEndpoints: [
    {
      method: 'POST', path: '/api/auth/register', name: 'Register',
      description: 'Create a new account and dispatch an email verification token.',
      body: '{\n  "email": "user@example.com",\n  "password": "min 8 chars",\n  "full_name": "Jane Doe"\n}',
      response: '{\n  "user": { "id": 42, "email": "...", "is_email_verified": false, "is_active": true }\n}',
    },
    {
      method: 'POST', path: '/api/auth/login', name: 'Login',
      description: 'Exchange credentials for an RS256 access token and a rotating refresh token.',
      body: '{\n  "email": "user@example.com",\n  "password": "..."\n}',
      response: '{\n  "user": { "id": 42, "email": "..." },\n  "access_token": "eyJhbGciOiJSUzI1NiIs...",\n  "refresh_token": "9f8...",\n  "refresh_expires_at": "2025-01-01T00:00:00.000Z"\n}',
    },
    {
      method: 'GET', path: '/api/auth/verify-email/:token', name: 'Verify email',
      description: 'Confirm an email address using the token delivered by the verification mail.',
      response: '{ "verified": true }',
    },
    {
      method: 'POST', path: '/api/auth/forgot-password', name: 'Forgot password',
      description: 'Trigger a password reset email. Always returns success to prevent user enumeration.',
      body: '{ "email": "user@example.com" }',
      response: '{ "sent": true }',
    },
    {
      method: 'POST', path: '/api/auth/reset-password/:token', name: 'Reset password',
      description: 'Set a new password using the reset token. All refresh tokens are revoked on success.',
      body: '{ "new_password": "min 8 chars" }',
      response: '{ "reset": true }',
    },
    {
      method: 'POST', path: '/api/auth/refresh', name: 'Refresh tokens',
      description: 'Rotate the refresh token and obtain a fresh access token. Reusing a rotated token fails closed.',
      body: '{ "refresh_token": "9f8..." }',
      response: '{\n  "access_token": "eyJ...",\n  "refresh_token": "newOpaqueToken",\n  "refresh_expires_at": "..."\n}',
    },
    {
      method: 'GET', path: '/.well-known/jwks.json', name: 'JWKS',
      description: 'Public key set for local JWT verification by downstream subsystems. Cacheable for 1 hour.',
      response: '{\n  "keys": [\n    { "kty": "RSA", "alg": "RS256", "use": "sig", "kid": "auth-key-1", "n": "...", "e": "AQAB" }\n  ]\n}',
    },
  ],
  protectedEndpoints: [
    {
      method: 'POST', path: '/api/auth/logout', name: 'Logout',
      description: 'Blacklist the current access token (jti) and revoke the supplied refresh token.',
      body: '{ "refresh_token": "9f8..." }   // optional',
      response: '{ "logged_out": true }',
    },
    {
      method: 'GET', path: '/api/auth/me', name: 'Get profile',
      description: 'Return the authenticated user’s public profile.',
      response: '{ "user": { "id": 42, "email": "...", "full_name": "Jane Doe" } }',
    },
    {
      method: 'PUT', path: '/api/auth/me', name: 'Update profile',
      description: 'Update mutable profile fields.',
      body: '{ "full_name": "Jane A. Doe" }',
      response: '{ "user": { "id": 42, "full_name": "Jane A. Doe" } }',
    },
    {
      method: 'POST', path: '/api/auth/change-password', name: 'Change password',
      description: 'Verify the current password and set a new one. All refresh tokens are revoked.',
      body: '{\n  "current_password": "...",\n  "new_password": "min 8 chars"\n}',
      response: '{ "changed": true }',
    },
  ],
  adminEndpoints: [
    {
      method: 'GET', path: '/api/admin/users', name: 'List users',
      description: 'Paginated list of users. Query: ?page=1&limit=20.',
      response: '{ "page": 1, "limit": 20, "total": 137, "total_pages": 7, "users": [ ... ] }',
    },
    {
      method: 'GET', path: '/api/admin/users/:id', name: 'Get user',
      description: 'Fetch a single user by id.',
      response: '{ "user": { "id": 42, "email": "...", "is_active": true } }',
    },
    {
      method: 'PUT', path: '/api/admin/users/:id/activate', name: 'Activate / deactivate',
      description: 'Toggle account access. Deactivation revokes all refresh tokens immediately.',
      body: '{ "is_active": false }',
      response: '{ "id": 42, "is_active": false }',
    },
    {
      method: 'DELETE', path: '/api/admin/users/:id', name: 'Delete user',
      description: 'Permanently remove a user (cascades to refresh tokens).',
      response: '{ "deleted": true }',
    },
  ],
};
