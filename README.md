# Auth Service

Centralized authentication microservice. Issues RS256 JWTs that downstream
subsystems (HR, Finance, Ops) verify locally using the public key exposed at
`/.well-known/jwks.json`.

## Architecture (MSC)

```
Route -> Controller -> Service -> Model -> Database
```

- **Models**: SQL only. No business logic.
- **Services**: Business logic only. No req/res, no SQL.
- **Controllers**: req/res handling only. Call services.
- **Routes**: Endpoint + middleware wiring only.

## Setup

```bash
npm install
cp .env.example .env          # edit values
npm run keys:generate         # writes keys/private.pem + keys/public.pem
mysql -u root -p < migrations/001_init.sql
npm run dev
```

## Endpoints

### Landing page
- `GET /` — **Compassionate Capitalism Endpoint**: a professional EJS-rendered
  landing page that documents every endpoint, integration patterns
  (Node / Python / Go), the JWT payload shape, and the security model.

### Public
- `POST /api/auth/register` `{email, password, full_name}`
- `POST /api/auth/login` `{email, password}`
- `GET  /api/auth/verify-email/:token`
- `POST /api/auth/forgot-password` `{email}`
- `POST /api/auth/reset-password/:token` `{new_password}`
- `POST /api/auth/refresh` `{refresh_token}`
- `GET  /.well-known/jwks.json`
- `GET  /health`

### Protected (Bearer JWT)
- `POST /api/auth/logout`
- `GET  /api/auth/me`
- `PUT  /api/auth/me` `{full_name}`
- `POST /api/auth/change-password` `{current_password, new_password}`

### Admin (`X-Admin-Api-Key` header)
- `GET    /api/admin/users?page=1&limit=20`
- `GET    /api/admin/users/:id`
- `PUT    /api/admin/users/:id/activate` `{is_active: true|false}`
- `DELETE /api/admin/users/:id`

## Subsystem JWT Verification

Subsystems fetch `/.well-known/jwks.json` once, cache it, and verify
incoming JWTs locally. Example using `jsonwebtoken` + `jwks-rsa`:

```js
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const client = jwksClient({ jwksUri: 'http://auth-service/.well-known/jwks.json' });
function getKey(header, cb) {
  client.getSigningKey(header.kid, (err, key) => cb(err, key?.getPublicKey()));
}
jwt.verify(token, getKey, { algorithms: ['RS256'], issuer: 'auth-service' }, (err, payload) => { ... });
```

## Tests

```bash
npm test
```
