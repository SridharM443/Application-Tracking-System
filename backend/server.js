const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { swaggerUi, swaggerSpec } = require('./swagger');

// Load environment variables FIRST
dotenv.config();

// Import database connection
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: ['*'],
  credentials: true 
}));

// HTTP request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Hybrid ATS API Docs'
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/bot', require('./routes/botMimicRoutes'));
app.use('/api/job-postings', require('./routes/jobPostingRoutes'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hybrid ATS API',
    version: '1.0.0',
    documentation: 'https://application-tracking-system-1-tdrv.onrender.com/api-docs/', // ← Add this
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      applications: '/api/applications',
      admin: '/api/admin',
      bot: '/api/bot',
      jobPostings: '/api/job-postings'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Get PORT from environment
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health\n`);
});

