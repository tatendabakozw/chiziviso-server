const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    loc: {
      lon: Number,
      lat: Number,
    },
    user: {
      type: String,
      required: true,
    },
    category: {
      String,
    },
    featured: {
      type: String,
      default: "",
    },
    description:{
      type: String,
      default: '',
      required: [true, "Please describe your location"]
    }
  },
  {
    timestamps: true,
  }
);

// mongoose.model('Location').aggregate().near({
//   near: [lng, lat],
//   distanceField: 'distance'
// })
locationSchema.index({ loc: "2d" });

module.exports = mongoose.model("Location", locationSchema);
