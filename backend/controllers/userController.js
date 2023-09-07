const asyncHandler = require("express-async-handler");
const Users = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Register a new user(require username, password and email)
//POST /api/user/
//Pbulic
const registerUser = asyncHandler(async (req, res) => {
  //Check required fields
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("Missing: username, password or email");
  }
  //Check if user already exists
  const user = await Users.findOne({ username });
  if (user) {
    res.status(404);
    throw new Error("User exists");
  }
  //Hash user password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  //Create user
  const newUser = await Users.create({
    username,
    password: hashed,
    email,
  });
  //Send response
  if (newUser) {
    res
      .status(201)
      .cookie("token", createJWT(newUser._id), {
        httpOnly: true,
        expires: new Date(Date.now() + 900000000),
        httpOnly: true,
        secure: true,
      })
      .json({
        _id: newUser._id,
        name: newUser.username,
        email: newUser.email,
        token: createJWT(newUser._id),
      });
  }
  //Send error failed to create user
  else {
    res.status(400);
    throw new Error("User not created");
  }
});

//Login a user(require username and password)
//POST /api/user/login
//Public
const loginUser = asyncHandler(async (req, res) => {
  //Check required fields
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Missing: username, password");
  }
  //Check if user exists and password is correct
  const user = await Users.findOne({ username });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }
  const result = await bcrypt.compare(password, user.password);
  //Send response
  if (user && result) {
    res
      .status(201)
      .cookie("token", createJWT(user._id), {
        expires: new Date(Date.now() + 900000000),
        httpOnly: true,
        secure: true,
      })
      .json({
        _id: user._id,
        name: user.username,
        email: user.email,
        token: createJWT(user._id),
      });
  }
  //Send error faild to login
  else {
    res.status(400);
    throw new Error("User not logged in");
  }
});

//Get current user's information(require token)
//GET /api/user/get
//Private
const getUser = asyncHandler(async (req, res) => {
  const { _id, username, email } = await Users.findById(req.user.id);
  res.json({
    id: _id,
    username,
    email,
  });
});

//Get all users
//GET /api/user/all
//Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await Users.find({ _id: { $ne: req.user.id } }).select([
    "email",
    "username",
  ]);
  res.json(users);
});

//Change user password
//PATCH /api/user/changePassword
//Private
const changePassword = asyncHandler(async (req, res) => {
  //check if new password is given
  if (!req.body.password) {
    res.status(404);
    throw new Error("Calendar not found");
  }
  //hash new password
  const newPassword = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  //update user
  const user = await Users.updateOne(
    { _id: req.user._id },
    { $set: { password: hashed } }
  );
  res.json(user);
});

//Register with google Oauth
//POST /api/user/oAuth
//Public
const regOauth = asyncHandler(async (req, res) => {
  //check if jwt is provided
  if (!req.body.jwt) {
    res.status(400);
    throw new Error("Missing: oAuth JWT");
  }
  const decoded = jwt.decode(req.body.jwt, (verify = false));
  //Check if user already exists
  const user = await Users.findOne({ username: decoded.name });
  if (user) {
    res
      .status(201)
      .cookie("token", createJWT(user._id), {
        httpOnly: true,
        expires: new Date(Date.now() + 900000000),
        httpOnly: true,
        secure: true,
      })
      .json({
        _id: user._id,
        name: user.username,
        email: user.email,
        token: createJWT(user._id),
      });
    return;
  }
  const newUser = await Users.create({
    username: decoded.name,
    email: decoded.email,
  });
  //Send response
  if (newUser) {
    res
      .status(201)
      .cookie("token", createJWT(newUser._id), {
        httpOnly: true,
        expires: new Date(Date.now() + 900000000),
        httpOnly: true,
        secure: true,
      })
      .json({
        _id: newUser._id,
        name: newUser.username,
        email: newUser.email,
        token: createJWT(newUser._id),
      });
  }
  //Send error failed to create user
  else {
    res.status(400);
    throw new Error("User not created");
  }
});

const logOut = asyncHandler(async (req, res) => {
  res
    .status(201)
    .cookie("token", "nothing", {
      httpOnly: true,
      expires: new Date(Date.now() + 1),
      httpOnly: true,
      secure: true,
    })
    .json({
      message: "Logged out",
    });
});

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  changePassword,
  regOauth,
  logOut,
};
