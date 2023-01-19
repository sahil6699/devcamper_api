/** info:
 * * We are having auth and user routes and  controllers,
 * * auth has to do with register users, encrypting passwords, logging in, geting currently loggedin users
 * * while user will be like CRUD for the user like
 * * add a user update a user and so on
 */

const { register } = require('../controller/auth');
const router = require('express').Router();

router.route('/register').post(register);

module.exports = router;
