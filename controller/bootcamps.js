// @dec Get all bootcamps
//@route GET /api/v1/bootcamps
// @access Public
const getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'show all bootcamps',
  });
};

// @dec CREATE a bootcamp
//@route POST /api/v1/bootcamps/
// @access Private
const createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'create new bootcamp',
  });
};

// @dec Get a bootcamp by Id
//@route GET /api/v1/bootcamps/:id
// @access Public
const getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show bootcamp ${req.params.id}`,
  });
};

// @dec Delete a bootcamp by Id
//@route DELETE /api/v1/bootcamps/:id
// @access Private
const deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    msg: `delete bootcamp ${req.params.id}`,
  });
};

// @dec Update a bootcamp by Id
//@route PUT /api/v1/bootcamps/:id
// @access Private
const updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `update bootcamp ${req.params.id}`,
  });
};

module.exports = {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
};
