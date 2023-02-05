const path = require('path');
const colors = require('colors');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');

// @dec Get all bootcamps
//@route GET /api/v1/bootcamps
// @access Public
const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @dec CREATE a bootcamp
//@route POST /api/v1/bootcamps/
// @access Private
const createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // if the user is not an admin they can only publish a single bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @dec Get a bootcamp by Id
//@route GET /api/v1/bootcamps/:id
// @access Public
const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @dec Delete a bootcamp by Id
//@route DELETE /api/v1/bootcamps/:id
// @access Private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  //findByIdAndDelete returns the document which has been deleted
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  await bootcamp.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @dec Update a bootcamp by Id
//@route PUT /api/v1/bootcamps/:id
// @access Private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

//@desc   Get bootcamp within a  radius
//@route  GET /api/v1/bootcamps/radius/:radius/:distance
//@access private
const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  console.log(zipcode, distance);

  //get lat/lng from the geocoder
  let loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  console.log(lat, 'lat');
  console.log(lng, 'lng');

  //Calc radius using radians
  //Divide radius by dist of the Earth
  //Earth radius = 3963 miles/6,378 kms
  const earthRadius = 3963; //miles
  console.log(loc);
  const radius = distance / earthRadius;
  console.log(radius);

  const bootcamp = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });
  console.log(bootcamp);

  res.status(200).json({
    success: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});

// @dec Upload photo for a bootcamp
//@route PUT /api/v1/bootcamps/:id/photo
// @access Private
const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Resource not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure the image is a file
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload and image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
};
