const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Register User
// @route     POST api/v1/auth/register
// @access    Public
const register = asyncHandler(async (req, res, next) => {
  const { name, password, email, role } = req.body;

  //Create User
  const user = await User.create({ name, email, password, role });

  //Create token
  const token = user.getSignedJwtToken();
  res.status(200).json({ success: true, token });
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

  //Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

module.exports = {
  register,
  login,
};
