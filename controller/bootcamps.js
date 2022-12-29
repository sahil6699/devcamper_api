const Bootcamp = require('../models/bootcamps');

// @dec Get all bootcamps
//@route GET /api/v1/bootcamps
// @access Public
const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

// @dec CREATE a bootcamp
//@route POST /api/v1/bootcamps/
// @access Private
const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

// @dec Get a bootcamp by Id
//@route GET /api/v1/bootcamps/:id
// @access Public
const getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      // we have wrote return here because we have wrote two response statements in a single try catch
      // if we don't write return it will show the below error
      //Error: Cannot set headers after they are sent to the client
      return res.status(400).json({
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    console.log(err);
    // res.status(400).json({
    //   success: false,
    // });
    next(err);
  }
};

// @dec Delete a bootcamp by Id
//@route DELETE /api/v1/bootcamps/:id
// @access Private
const deleteBootcamp = async (req, res, next) => {
  try {
    //findByIdAndDelete returns the document which has been deleted
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

// @dec Update a bootcamp by Id
//@route PUT /api/v1/bootcamps/:id
// @access Private
const updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};

module.exports = {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
};
