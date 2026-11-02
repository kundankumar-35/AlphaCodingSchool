
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import routes from './routes.js';

const app = express();


// ==========================================
// 1. CORS CONFIGURATION
// ==========================================

// Supports multiple frontend domains separated by commas.
// Example:
// CLIENT_URL=http://localhost:5173,https://alphacodingschool.com

const allowedOrigins = (
  process.env.CLIENT_URL || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {

      // Allow requests without an Origin header (e.g. Postman).
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    }
  })
);


// ==========================================
// 2. MIDDLEWARE
// ==========================================

app.use(express.json());


// ==========================================
// 3. HEALTH CHECK
// ==========================================

// Render uses this endpoint to check server availability.
// URL: https://your-backend.onrender.com/health

app.get('/health', (req, res) => {

  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: 'AlphaCodingSchool API',
    database: databaseConnected ? 'Connected' : 'Disconnected'
  });

});


// ==========================================
// 4. API ROUTES
// ==========================================

// All existing routes remain available under /api.

app.use('/api', routes);


// ==========================================
// 5. GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

  console.error('Server Error:', err);

  // Don't send another response if headers are already sent.
  if (res.headersSent) {
    return next(err);
  }

  // Invalid MongoDB document ID.
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid id.'
    });
  }

  // Invalid JSON request body.
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    'body' in err
  ) {
    return res.status(400).json({
      error: 'Invalid JSON body.'
    });
  }

  // Rejected frontend origin.
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'Origin not allowed.'
    });
  }

  // Default server error.
  return res.status(500).json({
    error: 'Server error. Try again.'
  });

});


// ==========================================
// 6. MONGODB CONNECTION
// ==========================================

const MONGO_URI =
  process.env.MONGO_URI;

const PORT = process.env.PORT || 5000;


// ==========================================
// 7. START SERVER
// ==========================================

// Connect to MongoDB before accepting API requests.
// If the database connection fails, stop the server.

try {

  await mongoose.connect(MONGO_URI);

  console.log('MongoDB connected successfully');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AlphaCodingSchool API running on port ${PORT}`);
  });

} catch (error) {

  console.error('MongoDB connection failed:', error);

  process.exit(1);

}
