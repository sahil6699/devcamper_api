const colors = require('colors');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

// @dec   Get all courses
//@route  GET /api/v1/courses - used to give out all the courses
//@route  GET /api/v1/bootcamps/:bootcampId/courses - used to give all the courses of a particular bootcamp with a given id
//@access Public
const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    // query = Course.find({});
    // query = Course.find({}).populate('bootcamp');//to the whole bootcamp into the course we use this
    //or
    //if we just want to populate certain fields only then we use this
    query = Course.find({}).populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  let courses = await query;
  res.json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

module.exports = { getCourses };
