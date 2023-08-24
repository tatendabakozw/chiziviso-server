const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");

var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(500).send({ message: "User already exists" });
    }
    if (!emailFormat.test(email)) {
      return res.status(401).send({ message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .send({ message: "Password must be greater than 6 characters" });
    }

    const newUser = new User({
      full_name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
    });

    const savedUser = await newUser.save();

    return res.status(200).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
