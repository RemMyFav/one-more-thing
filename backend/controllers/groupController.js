const asyncHandler = require("express-async-handler");
const Calendar = require("../models/Group");
const User = require("../models/User");

//Get all calendars of one user
//GET /api/groupCalendar
//Private, owner can get all of his calendars
const getCalendars = asyncHandler(async (req, res) => {
  const calendarList = await Calendar.find({ owner: req.user._id });
  res.json(calendarList);
});

//Get all calendars that this user participate in
//GET /api/groupCalendar/joined
//Private, user can get all of calendars that he participate in
const joinCalendars = asyncHandler(async (req, res) => {
  const calendarList = await Calendar.find({ participant: req.user._id });
  res.json(calendarList);
});

//Get specific one calendar of one user
//GET /api/groupCalendar/:id
//Private, owner and participant can get the calendar
const getCalendar = asyncHandler(async (req, res) => {
  const calendar = await Calendar.findById(req.params.id);
  //Check if calendar exists
  if (!calendar) {
    res.status(404);
    throw new Error("Calendar not found");
  }
  //Check if user is owner of this calendar
  if (
    calendar.owner.toString() !== req.user._id.toString() &&
    !calendar.participant.includes(req.user._id)
  ) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const oneCalendar = await Calendar.findById(req.params.id);
  res.json(oneCalendar);
});

//Create a Calendar for specific user
//required: title
//POST /api/groupCalendar
//Private, anyone can create a calendar if they logged in
const createCalendar = asyncHandler(async (req, res) => {
  //Check required title
  if (!req.body.title) {
    res.status(400);
    throw new Error("Title is required");
  }
  //Create new calendar
  const calendar = await Calendar.create({
    title: req.body.title,
    owner: req.user._id,
    createDate: new Date(),
    participant: [],
  });
  res.json(calendar);
});

//Update a Calendar(Add a particpant to calendar)
//required: participant
//PATCH /api/groupCalendar/:id/addParticipant
//Private, only owner can add participant
const updateParticipant = asyncHandler(async (req, res) => {
  //Check if calendar exists
  const calendar = await Calendar.findById(req.params.id);
  if (!calendar) {
    res.status(404);
    throw new Error("Calendar not found");
  }
  //Check if user is owner of this calendar
  if (calendar.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  //Check if user provide participant field
  const newParticipant = req.body.participant;
  if (!newParticipant) {
    res.status(400);
    throw new Error("Participant is required");
  }
  //Check if user exist
  const user = await User.find({ _id: newParticipant });
  const updateCalendar = await Calendar.updateOne(
    { _id: req.params.id },
    { $set: { participant: user } }
  );
  res.json(updateCalendar);
});

//Update a Calendar(Change title of calendar)
//required: title
//PATCH /api/groupCalendar/:id/changeTitle
//Private, only owner can change title
const updateTitle = asyncHandler(async (req, res) => {
  //Check if calendar exists
  const calendar = await Calendar.findById(req.params.id);
  if (!calendar) {
    res.status(404);
    throw new Error("Calendar not found");
  }
  //Check if user is owner of this calendar
  if (calendar.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  //Check if user provide title field
  const newTitle = req.body.title;
  if (!newTitle) {
    res.status(400);
    throw new Error("Title is required");
  }
  const updateCalendar = await Calendar.updateOne(
    { _id: req.params.id },
    { $set: { title: req.body.title } }
  );
  res.json(updateCalendar);
});

//Delete a Calendar
//DELETE /api/groupCalendar/:id
//Private, only owner can delete a calendar
const deleteCalendar = asyncHandler(async (req, res) => {
  //Check if calendar exists
  const calendar = await Calendar.findById(req.params.id);
  if (!calendar) {
    res.status(404);
    throw new Error("Calendar not found");
  }
  //Check if user is owner of this calendar
  if (calendar.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const deleted = await Calendar.deleteOne({ _id: req.params.id });
  res.json(deleted);
});

module.exports = {
  getCalendars,
  getCalendar,
  createCalendar,
  updateTitle,
  updateParticipant,
  deleteCalendar,
  joinCalendars,
};
