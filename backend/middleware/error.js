const config = require('../config/config');

// Custom error class for API errors
class APIError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response
  if (config.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // Production error response
  else {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    else {
      // Log error for debugging
      console.error('ERROR 💥', err);

      // Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

// Handle MongoDB duplicate key errors
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate ${field}. Please use another value.`;
  return new APIError(400, message);
};

// Handle MongoDB validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new APIError(400, message);
};

// Handle JWT errors
const handleJWTError = () =>
  new APIError(401, 'Invalid token. Please log in again.');

const handleJWTExpiredError = () =>
  new APIError(401, 'Your token has expired. Please log in again.');

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // MongoDB duplicate key error
  if (error.code === 11000) error = handleDuplicateKeyError(error);

  // MongoDB validation error
  if (error.name === 'ValidationError') error = handleValidationError(error);

  // JWT errors
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  errorHandler(error, req, res, next);
};

module.exports = {
  APIError,
  globalErrorHandler
};