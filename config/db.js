const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDb connected successfully'.cyan.underline.bold);
};

module.exports = connectDB;
