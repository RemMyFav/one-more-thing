const express = require("express");
const router = express.Router();
const authed = require("../middleware/authCheck");
const User = require("../models/User");
const {
  getCalendars,
  getCalendar,
  createCalendar,
  updateTitle,
  deleteCalendar,
} = require("../controllers/personalController");
const { checkId } = require("../middleware/checkPersonId");

//Get all Calendars rounter
router.get("/", authed, getCalendars);

//Get one specific Calendars
router.get("/:id", authed, getCalendar);

//Create a Calendar
router.post("/", authed, createCalendar);

//Delete a Calendar
router.delete("/:id", authed, deleteCalendar);

//Update a Calendar(Change title)
router.patch("/:id", authed, updateTitle);

//jump to todo router checkId middle to set calendarId to req.body.calendarId
router.use("/:id/todo", checkId, require("../routes/todo"));

module.exports = router;
