const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'Centralized auth microservice with JWT RS256, PostgreSQL, Express\n\nFeatures & Significants management endpoints for displaying website content.',
      contact: {
        name: 'Auth Service Team',
        email: 'support@example.com',
        url: 'https://example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      tags: [
        {
          name: 'Authentication',
          description: 'User registration, login, email verification, password reset, and token management.'
        },
        {
          name: 'User',
          description: 'Authenticated user profile and password management.'
        },
        {
          name: 'Admin',
          description: 'Admin-only endpoints for user management.'
        },
        {
          name: 'Features',
          description: 'Endpoints for managing and displaying website features.'
        },
        {
          name: 'Significants',
          description: 'Endpoints for managing and displaying significant items on the website.'
        }
      ],
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            full_name: { type: 'string' },
            is_email_verified: { type: 'boolean' },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          },
          description: 'A registered user of the system.',
          example: {
            id: 1,
            email: 'user@example.com',
            full_name: 'Jane Doe',
            is_email_verified: true,
            is_active: true,
            created_at: '2026-05-01T12:00:00Z'
          }
        },
        Feature: {
          type: 'object',
          required: ['title', 'description', 'image_url'],
          properties: {
            id: { type: 'integer' },
            title: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
            image_url: { type: 'string', format: 'uri' },
            thumbnail_url: { type: 'string', format: 'uri' },
            category: { type: 'string', maxLength: 100 },
            order: { type: 'integer', default: 0 },
            is_active: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          description: 'A core feature displayed on the website.',
          example: {
            id: 1,
            title: 'Seamless Integration',
            description: 'Integrate with your favorite tools in seconds.',
            image_url: 'https://cdn.example.com/images/feature1.png',
            thumbnail_url: 'https://cdn.example.com/images/feature1-thumb.png',
            category: 'integration',
            order: 1,
            is_active: true,
            created_at: '2026-05-01T12:00:00Z',
            updated_at: '2026-05-01T12:00:00Z'
          }
        },
        Significant: {
          type: 'object',
          required: ['title', 'description', 'image_url'],
          properties: {
            id: { type: 'integer' },
            title: { type: 'string', maxLength: 255 },
            description: { type: 'string' },
            image_url: { type: 'string', format: 'uri' },
            thumbnail_url: { type: 'string', format: 'uri' },
            icon_url: { type: 'string', format: 'uri' },
            highlight_text: { type: 'string', maxLength: 255 },
            priority: { type: 'integer', default: 0 },
            is_active: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          },
          description: 'A significant item or highlight for the website.',
          example: {
            id: 1,
            title: 'Award-Winning Security',
            description: 'Our platform is recognized for top-tier security standards.',
            image_url: 'https://cdn.example.com/images/security.png',
            thumbnail_url: 'https://cdn.example.com/images/security-thumb.png',
            icon_url: 'https://cdn.example.com/icons/security.svg',
            highlight_text: '2026 Winner',
            priority: 1,
            is_active: true,
            created_at: '2026-05-01T12:00:00Z',
            updated_at: '2026-05-01T12:00:00Z'
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          },
          description: 'Standard error response.',
          example: {
            success: false,
            message: 'Not found'
          }
        }
      }
    }
  },
  apis: [
    './src/routes/auth.routes.js',
    './src/routes/user.routes.js',
    './src/routes/admin.routes.js',
    './src/routes/feature.routes.js',
    './src/routes/significant.routes.js'
  ]
};

const specs = swaggerJsdoc(options);
module.exports = specs;