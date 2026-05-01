require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const logger = require('./utils/logger');
const swaggerSpecs = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const featureRoutes = require('./routes/feature.routes');
const significantRoutes = require('./routes/significant.routes');
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
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts for interactive forms
      imgSrc: ["'self'", "data:"],
    },
  },
}));

app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Views (EJS) and static assets - FIXED PATH
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views')); // Go up one level to root views directory
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h' })); // Also fix public path

// Rate limiting
const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const generalLimiter = rateLimit({ 
  windowMs: 60 * 1000, 
  max: 200,
  standardHeaders: true,
  legacyHeaders: false 
});

app.use('/api/auth', authLimiter);
app.use(generalLimiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Public routes
app.get('/', landingCtrl.index);
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/.well-known/jwks.json', jwksCtrl.jwks);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/significants', significantRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = +process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => logger.info(`✅ auth-service listening on http://localhost:${PORT}`));
}

module.exports = app;