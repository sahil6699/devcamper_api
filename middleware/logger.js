// @desc logs request to console
const logger = (req, res, next) => {
  // req.hello = 'hello python';
  // console.log('Middleware called');
  console.log(`
    ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}
  `);
  next();
};

module.exports = logger;
