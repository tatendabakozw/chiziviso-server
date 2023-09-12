const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

//register user
// post request
// /api/post/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, confirm_password } = req.body;
    var mailArr = email.split("@");
    var logn = mailArr[0];

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
    if (confirm_password !== password) {
      return res.status(400).send({ message: "Passwords do not match!" });
    }

    const newUser = new User({
      full_name: logn,
      email: email,
      password: bcrypt.hashSync(password, 10),
    });

    const savedUser = await newUser.save();

    return res.status(200).json({
      message: "User registered successfully",
      user: {
        createdAt: savedUser.createdAt,
        email: savedUser.email,
        full_name: savedUser.full_name,
        _id: savedUser._id,
      },
    });
  } catch (error) {
    next(error);
  }
});

// logn user
// post request
// /api/post/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password) {
      return res.status(400).send({ message: "Please enter password" });
    }
    if (!email) {
      return res.status(400).send({ message: "Please enter password" });
    }

    const _user = await User.findOne({ email });

    if (!_user) {
      return res.status(404).send({ message: "Account does not exist!" });
    }
    // if (!_user.emailVerified) {
    //   return res.status(403).send({ message: "Please verify your email" });
    // }
    // do other checks here before allowing user to login

    const password_correct = await bcrypt.compare(password, _user.password);

    if (password_correct) {
      const token = await jwt.sign(
        {
          email: _user.email,
          _id: _user._id,
          role: _user.role,
          emailVerified: _user.emailVerified,
          photoURL: _user.photoURL,
        },
        process.env.JWT_SECRET
      );
      if (token) {
        const user = {
          email: _user.email,
          _id: _user._id,
          role: _user.role,
          emailVerified: _user.emailVerified,
          photoURL: _user.photoURL,
          token: token,
        };

        return res.send({ ...user, message: "logged in sucessfully" });
      } else {
        return res
          .status(422)
          .send({ message: "Failed to login, Wrong details!" });
      }
    } else {
      return res.status(400).send({ message: "Wrong login details" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
