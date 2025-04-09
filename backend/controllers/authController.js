const User = require('../models/User');
const { APIError } = require('../middleware/error');
const {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies
} = require('../middleware/auth');

// Register new user
const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError(400, 'User already exists with this email');
    }

    // Create new user
    const user = new User({
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      status: 'success',
      data: {
        accessToken: accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refresh = async (req, res, next) => {
  try {
    const user = req.user; // Set by verifyRefreshToken middleware

    // Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set new cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      status: 'success',
      data: {
        accessToken: accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    const user = req.user;

    // Clear refresh token in database
    user.refreshToken = null;
    await user.save();

    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('refreshToken');

    res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout
};