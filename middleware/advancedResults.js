const advancedResults = (model, populate) => async (req, res, next) => {
  //declare the query
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //we have to convert query to string here so that we an manipulate it,basically we are creating the query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators like($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit; //here skip is renamed as startIndex, it represent how many document from starting we want to skip
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }
  //Executing the query
  const results = await query;

  //Pagination result
  const pagination = {};

  // if don't have a previous page we don't wanna show a previous page,if we don't have a next page we don't wanna show a next page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };
  next();
};

module.exports = advancedResults;
