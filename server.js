const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');

//Load env variables
dotenv.config({ path: './config/config.env' });

//connect to DB
connectDB();

//Route files
const bootcampRouter = require('./routes/bootcamps');
// const logger = require('./middleware/logger');

const app = express();

app.use(express.json());

// DEV Login  middleware
// app.use(logger);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

//Mount router
app.use('/api/v1/bootcamps', bootcampRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
