const express = require('express');
const dotenv = require('dotenv');

//Route files
const bootcampRouter = require('./routes/bootcamps');

//Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

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
