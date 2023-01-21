const router = require('express').Router();
const {
  getBootcamps,
  getBootcamp,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controller/bootcamps');

//include bootcamps
const Bootcamp = require('../models/Bootcamps');

//include advanced result bootcamps
const advancedResults = require('../middleware/advancedResults');

//include protect middleware
const { protect } = require('../middleware/auth');

//Include other resource router
const courseRouter = require('./courses');

router.use('/:bootcampId/courses/', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .delete(protect, deleteBootcamp)
  .put(protect, updateBootcamp);

module.exports = router;
