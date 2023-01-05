const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const BootcampSchema = new mongoose.Schema(
  {
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
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      //Array of strings
      type: [String],
      //TODO: make required true after testing
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
    jobAssistance: {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Create Bootcamp slug from the name
BootcampSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

//Geocode and create location field
BootcampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  //Do no save address in db
  this.address = undefined;
  next();
});

//Reverse populate with virtual
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});
module.exports = mongoose.model('Bootcamp', BootcampSchema);
