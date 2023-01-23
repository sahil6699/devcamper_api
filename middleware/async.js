const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// simpler way to write the above function
// const asyncWrapper = function (fn) {
//   function someOne(req, res, next) {
//     return Promise.resolve(fn(req, res, next)).catch(next);
//   }
// };

module.exports = asyncHandler;
