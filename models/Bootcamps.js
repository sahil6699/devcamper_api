const mongoose = require('mongoose');

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  /* slug is the url friendly version of the name
  for eg: name is Devcentral  Bootcamp
  than slug would be devcentral-bootcamp 
  so that it can be used as the url link from the front end*/
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [500, 'Name cannot be more than 500 characters'],
  },
  //we are using regex to check if the website is http/https or not
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please enter a valid http or https url',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone no cannot be longer than 20 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please add a address'],
  },
  location: {
    //GeoJson Point
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      //TODO: //MAKE REQUIRED TRUE
      index: '2dsphere',
    },
  },
  formattedAddress: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  careers: {
    //Array of strings
    type: [String],
    //TODO: make required true after testinjg
    required: false,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be atleast 1'],
    max: [10, "Rating can't be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssitance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
