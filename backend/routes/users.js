const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register

router.post("/register", async (req, res) => {
  try {
    //Generate New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create New User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //Save User and Respond
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    //Find User
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong username or password!");

    //Validate Password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong username or password!");

    //Send Res
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
