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
    user:{
        type: String,
        required: true
    },
    category:{
        String
    }
  },
  {
    timestamps: true,
  }
);
locationSchema.index({ loc: "2d" });

module.exports = mongoose.model("Location", locationSchema);
