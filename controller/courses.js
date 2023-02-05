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
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
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
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to create course on the bootcamp ${bootcamp._id} `,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.json({
    success: true,
    data: course,
  });
});

// @dec   Update course
//@route  PUT /api/v1/courses/:id
//@access private
const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found  with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update the course ${course._id}`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: course,
  });
});

// @dec   Delete course
//@route  DELETE /api/v1/courses/:id
//@access private
const deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found  with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete the course ${course._id}`,
        401
      )
    );
  }

  //we are using remove because later we want to use some middleware which will run while removing the document, which will not happen in the case of findByIdAndUpdate
  await course.remove();

  res.json({
    success: true,
    data: {},
  });
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
