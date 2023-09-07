const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  changePassword,
  regOauth,
  logOut,
} = require("../controllers/userController.js");
const authed = require("../middleware/authCheck.js");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/oAuth", regOauth);
router.get("/get", authed, getUser);
router.get("/all", authed, getAllUsers);
router.patch("/changePassword", authed, changePassword);
router.post("/logOut", logOut);

module.exports = router;
