const express = require("express");
const User = require("../models/User");
const { requireUserSignIn } = require("../../../nsfw/server/middleware/auth");
const router = express.Router();

// edit single user
// patch request
// /api/user/edit
router.patch("/edit",requireUserSignIn, async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const user = await User.findOne({ _id: user_id });

    // get iformation from client
    const {
      full_name,
      old_password,
      new_password,
      picture_url,
      gender,
      country,
    } = req.body;

    if (!user) {
      res.status(404).send({ message: "Could not find the user" });
      return;
    }

    // check if user is allowed to edit the acciut
    if (req.user._id !== user_id) {
      res.status(403).send({ message: "You can only edit your account" });
      return;
    }
    if (new_password) {
      // if user wants to edit password
      if (old_password) {
        // decrypt password value from database
        const password_correct = await bcrypt.compare(
          old_password,
          user.password
        );
        // if password decrypted set the new password
        if (password_correct) {
          user.password = bcrypt.hashSync(new_password, 12);
          user.full_name = full_name;
          user.photoURL = picture_url;
          user.gender = gender;
          user.country = country;
          await user.save();
          return res.status(200).send({ message: "Account has been updated" });
        } else {
          res.status(403).send({ message: "Old password is incorrect" });
          return;
        }
      } else {
        return res
          .status(403)
          .send({ message: "Please enter your correct old password" });
      }
    }

    user.photoURL = picture_url;
    user.full_name = full_name;
    user.gender = gender;
    user.country = country;

    await user.save();
    return res.status(200).send({ message: "Information saved" });
  } catch (error) {
    next(error);
  }
});

// get single user
// get request
// /api/user/single
router.get("/single", async (req, res, next) => {
  try {
    console.log("get single user info");
  } catch (error) {
    next(error);
  }
});

// delete single user
// admin route
// delete request
// /api/user/delete
router.delete("/delete", async (req, res, next) => {
  try {
    console.log("delete sinfle user");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
