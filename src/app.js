require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const jwksCtrl = require('./controllers/jwks.controller');
const landingCtrl = require('./controllers/landing.controller');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Helmet — relax CSP just enough for the EJS landing page (Google Fonts + inline asset refs).
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));
app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Views (EJS) and static assets for the Compassionate Capitalism Endpoint landing page.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true });
const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use(generalLimiter);

app.get('/', landingCtrl.index);
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/.well-known/jwks.json', jwksCtrl.jwks);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth', userRoutes); // /me, /change-password share /api/auth prefix
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = +process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => logger.info(`auth-service listening on :${PORT}`));
}

module.exports = app;
