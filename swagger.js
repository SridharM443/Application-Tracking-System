const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hybrid ATS API Documentation',
      version: '1.0.0',
      description: 'API documentation for Hybrid Applicant Tracking System',
      contact: {
        name: 'API Support',
        email: 'support@hybrid-ats.com'
      }
    },
    servers: [
      {
        url: 'https://application-tracking-system-1-tdrv.onrender.com',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './models/*.js'] // Path to API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };

