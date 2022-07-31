const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const route = express.Router();

const User = require("../model/user");

// create user
route.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    } = req.body;
    const checkUser = await User.find({ email });
    if (checkUser)
      return res.status(400).json({ message: "This user already exist.." });

    const newUser = new User({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    });
    const user = await newUser.save();
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "The user cannot be created...",
      });
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});

// get all uers
route.get("/", async (req, res) => {
  try {
    const userList = await User.find().select("-passwordHash");
    if (!userList) return res.status(500).json({ success: false });
    res.status(200).json(userList);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});

// get one user
route.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});

// user login
route.post("/login", async (req, res) => {
  try {
    const secret = process.env.SECRET;
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send("User not found. Email or Password is incorrect");
    }

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin
        },
        secret,
        {expiresIn: '1d'}
      )
      return res.status(200).json({message:"User Authenticated", token});

    } else {
      return res
        .status(400)
        .send("Email or Password is incorrect");
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
});

// delete user
route.delete("/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    const user = await Product.findByIdAndRemove(userId);

    if(user) {
      return res.status(200).json({success: true, message: 'The user is deleted...'});
    } else {
      return res.status(404).json({success: false, message: 'user not found...'});
    }
  } catch (err) {
    res.status(400).json({
        error: err.message,
        success: false 
    })
  }
});

module.exports = route;
