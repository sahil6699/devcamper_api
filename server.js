const express = require('express');
const dotenv = require('dotenv');

//Load env variables
dotenv.config({ path: './config/config.env' });

const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello from the world of express</h1>');
});

const PORT = process.env.PORT || 5000;
('');

app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
