const colors = require('colors');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamps');

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

// @dec   Get Single courses
//@route  GET /api/v1/courses/:id - used to give out the courses with particular id
//@access Public
const getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  res.json({
    success: true,
    data: course,
  });
});

// @dec   Add course
//@route  POST /api/v1/bootcamp/:bootcampId/courses
//@access private
const createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  const course = await Course.create(req.body);

  res.json({
    success: true,
    data: course,
  });
});

module.exports = { getCourses, getCourse, createCourse };
