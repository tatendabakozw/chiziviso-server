const express = require("express");
const { requireAdminSignIn } = require("../middleware/auth");
const Location = require("../models/Location");
const router = express.Router();

//add location
//post request
// /api/location/add
router.post("/add", requireAdminSignIn, async (req, res, next) => {
  try {
    const _user = req.user;
    const { name, lon, lat, category, picture, description } = req.body;
    const newLocation = new Location({
      name,
      picture: picture,
      loc: {
        lon: lon,
        lat: lat,
      },
      user: _user._id,
      category,
      description,
    });

    const savedLocation = await newLocation.save();

    return res
      .status(200)
      .send({ message: "Location saved succesfull", location: savedLocation });
  } catch (error) {
    next(error);
  }
});

// find near locations
// post request
// /api/location/near/?lon=51&lat=-114
router.post("/near", async (req, res, next) => {
  try {
    const { lon, lat, category } = req.body;
    // const locations = await Location.find({
    //   loc: { $near: [lon, lat] },
    //   category: category,
    // }).limit(5);


    const locations = await Location.aggregate([
      {
        $geoNear: {
          near:  [lon, lat],
          // maxDistance: 500 * 1609,
          key: "myLocation",
          spherical: true,
          distanceField: "distance",
          category: category,
          distanceMultiplier: 0.001,
        },
      },
    ])
    return res.status(200).send({ locations });
  } catch (error) {
    next(error);
  }
});

// get single location
// get request
// /api.location/single
router.get("/single", async (req, res, next) => {
  try {
    const { location_id } = req.query;
    if (!location_id) {
      return res
        .status(403)
        .send({ message: "Please provide location identity!" });
    }
    const location = await Location.findOne({ _id: location_id });
    if (!location) {
      return res.status(404).send({ message: "Location not found" });
    }
    return res.status(200).send({ message: "Location found", location });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
