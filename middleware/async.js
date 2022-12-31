const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const asyncWrapper = function (fn) {
  function someOne(req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  }
};

module.exports = asyncHandler;
