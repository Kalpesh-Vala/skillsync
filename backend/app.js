const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const connectDB = require('./config/database');
const { globalErrorHandler } = require('./middleware/error');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.COOKIE_SECRET));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(globalErrorHandler);

// Handle unhandled routes
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;