const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const { StatusCodes } = require('http-status-codes');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(StatusCodes.CREATED).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse(
          'Please provide an email and password',
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(
        new ErrorResponse(
          'Invalid credentials',
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(
        new ErrorResponse(
          'Invalid credentials',
          StatusCodes.UNAUTHORIZED
        )
      );
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(StatusCodes.OK).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
