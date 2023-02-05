const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const dotenv = require('dotenv').config({ path: './config/config.env' });

// @desc      Register User
// @route     POST api/v1/auth/register
// @access    Public
const register = asyncHandler(async (req, res, next) => {
  const { name, password, email, role } = req.body;

  //Create User
  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);
});

// @desc      Login User
// @route     POST api/v1/auth/login
// @access    Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  /**
   * Validate email
   * * we are validating email here and not it registering user because there we have our mongoose validator
   */
  if (!email || !password) {
    return next(
      new ErrorResponse('Please provide email and password both'),
      400
    );
  }
  //Check if the user is present or not
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     POST api/v1/auth/me
// @access    private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Forgot Password
// @route     POST api/v1/auth/forgotPassword
// @access    public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new ErrorResponse(`There is no user with that email`, 404));
  }

  // Get reset Token
  // * we going to have this get reset password token on our model
  const resetToken = await user.getResetPasswordToken();

  console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();
  console.log(token);
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (options.secure) {
    options.secure = true;
  }
  // FIXME: The cookies are showing in thunder client but not in postman
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
};
