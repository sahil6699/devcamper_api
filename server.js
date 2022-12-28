const express = require('express');
const dotenv = require('dotenv');

//Route files
const bootcampRouter = require('./routes/bootcamps');
const logger = require('./middleware/logger');
const morgan = require('morgan');
//Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

// DEV Loggin  middleware
// app.use(logger);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

app.use(express.json());

//Mount router
app.use('/api/v1/bootcamps', bootcampRouter);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
