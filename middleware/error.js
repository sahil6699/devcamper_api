const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack.red);

  // Log to console for dev
  console.log(err);

  //Mongoose bad objectID
  if (err.name === 'CastError') {
    const message = `Resource not found with the id of ${err.value}`;
    error = new ErrorResponse(message, err.statusCode || 404);
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field values entered`;
    error = new ErrorResponse(message, err.statusCode || 400);
  }

  //Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    console.log(message, 'messageva');
    error = new ErrorResponse(message, 400);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
