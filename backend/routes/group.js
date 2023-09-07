const express = require("express");
const router = express.Router();
const authed = require("../middleware/authCheck");
const User = require("../models/User");
const {
  getCalendars,
  getCalendar,
  createCalendar,
  updateTitle,
  updateParticipant,
  deleteCalendar,
  joinCalendars,
} = require("../controllers/groupController");
const { checkId } = require("../middleware/checkGroupId");

//Get all Calendars that the user owned
router.get("/", authed, getCalendars);

//Get all Calendars that the user participated
router.get("/joined", authed, joinCalendars);

//Get one specific Calendars
router.get("/:id", authed, getCalendar);

//Create a Calendar
router.post("/", authed, createCalendar);

//Delete a Calendar
router.delete("/:id", authed, deleteCalendar);

//Update a Calendar(Add a particpant to calendar)
router.patch("/:id/addParticipant", authed, updateParticipant);

//Update a Calendar(Change title)
router.patch("/:id/changeTitle", authed, updateTitle);

//jump to todo router checkId middle to set calendarId to req.body.calendarId
router.use("/:id/todo", checkId, require("../routes/todo"));

module.exports = router;
