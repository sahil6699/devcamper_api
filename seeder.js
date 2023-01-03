const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env variables
dotenv.config({ path: './config/config.env' });

//load models
const Bootcamp = require('./models/Bootcamp');

//to remove depreciation warnings
mongoose.set('strictQuery', false);

//connect to DB
mongoose.connect(process.env.MONGO_URI);

//Read the JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`),
  'utf-8'
);

//Import into DB

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log('Data Imported....'.green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//Delete from the DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log('Data Destroyed....'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
