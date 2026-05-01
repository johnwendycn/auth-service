require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

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

// Import upload modules
const uploadController = require('./controllers/upload.controller');
const imageService = require('./services/image.service');
const admin = require('./middleware/admin.middleware');

const app = express();

// Helmet with relaxed CSP for inline styles and scripts
// Update helmet configuration in app.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'unsafe-inline'"], // This allows inline event handlers
      imgSrc: ["'self'", "data:", "https://*", "blob:"],
      connectSrc: ["'self'", "https://*"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Views (EJS) and static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h' }));

// Serve uploaded images from public/img folder
app.use('/img', express.static(path.join(__dirname, '..', 'public/img')));

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

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use(generalLimiter);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Public routes
app.get('/', landingCtrl.index);
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/.well-known/jwks.json', jwksCtrl.jwks);

// ============ UPLOAD ROUTES (ADD THIS SECTION) ============
// Image upload endpoints (admin only)
app.post('/api/upload', admin, imageService.upload.single('image'), uploadController.uploadImage);
app.post('/api/upload/multiple', admin, imageService.upload.array('images', 5), uploadController.uploadMultipleImages);
app.delete('/api/upload/:filename', admin, uploadController.deleteImage);
// =========================================================

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/significants', significantRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT) || 3000;

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'public/img');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info(`📁 Created upload directory: ${uploadDir}`);
}

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`✅ auth-service listening on http://localhost:${PORT}`);
    logger.info(`📁 Upload directory: ${uploadDir}`);
    logger.info(`🌐 API Docs: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;