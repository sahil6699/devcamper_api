const mongoose = require('mongoose');

//to remove deprciaton warning
mongoose.set('strictQuery', false);

const connectDB = async () => {
  mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDb connected successfully'.cyan.underline.bold);
};

module.exports = connectDB;
