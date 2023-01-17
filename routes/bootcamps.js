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

//Include other resource router
const courseRouter = require('./courses');

router.use('/:bootcampId/courses/', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

module.exports = router;
