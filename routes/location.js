const express = require("express");
const { requireUserSignIn, requireAdminSignIn } = require("../middleware/auth");
const Location = require("../models/Location");
const router = express.Router();

//add location
//post request
// /api/location/add
router.post("/add", requireAdminSignIn, async (req, res, next) => {
  try {
    const _user = req.user;
    const { name, lon, lat, category } = req.body;
    const newLocation = new Location({
      name,
      picture: "",
      loc: {
        lon: lon,
        lat: lat,
      },
      user: _user._id,
      category,
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
    const locations = await Location.find({
      loc: { $near: [lon, lat] },
      category: category,
    }).limit(2);
    return res.status(200).send({ locations });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
