/** info:
 * * We are having auth and user routes and  controllers,
 * * auth has to do with register users, encrypting passwords, logging in, geting currently loggedin users
 * * while user will be like CRUD for the user like
 * * add a user update a user and so on
 */

const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controller/auth');
const router = require('express').Router();
const { protect } = require('../middleware/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
module.exports = router;
