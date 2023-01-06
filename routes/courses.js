const router = require('express').Router({ mergeParams: true });
const {
  getCourses,
  getCourse,
  createCourse,
} = require('../controller/courses');

router.route('/').get(getCourses).post(createCourse);
router.route('/:id').get(getCourse);

module.exports = router;
