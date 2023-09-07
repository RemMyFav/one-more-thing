const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const authed = asyncHandler(async (req, res, next) => {
  let token;
  //Check if header passed in and cookie exist
  if (req.cookies.token) {
    try {
      //get token
      token = req.cookies.token;
      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //get user
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(404);
        throw new Error("Token user not found");
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error("Unauthorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("No auth, Can't find token");
  }
});
const jwtAuthed = asyncHandler(async (req, res, next) => {
  console.log(req.cookies.wtf);
  //Bearer token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token
      token = req.headers.authorization.split(" ")[1];
      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //get user
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        res.status(404);
        throw new Error("Token user not found");
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(401);
      throw new Error("Unauthorized");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("No auth, Can't find token");
  }
});

module.exports = authed;
