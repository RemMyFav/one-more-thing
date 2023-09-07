const asyncHandler = require("express-async-handler");
const Calendar = require("../models/Personal");

//Get all calendars of one user
//GET /api/personalCalendar
//Private owner can get all of his calendars
const getCalendars = asyncHandler(async (req, res) => {
  const calendarList = await Calendar.find({ owner: req.user._id });
  res.json(calendarList);
});

//Get specific one calendar of one user
//GET /api/personalCalendar/:id
//Private, owner can get the calendar
const getCalendar = asyncHandler(async (req, res) => {
  const calendar = await Calendar.findById(req.params.id);
  //Check if calendar exists
  if (!calendar) {
    res.status(404);
    throw new Error("Calendar not found");
  }
  //Check if user is owner of this calendar
  if (calendar.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }
  const oneCalendar = await Calendar.findById(req.params.id);
  res.json(oneCalendar);
});

//Create a Calendar
//require: title
//POST /api/personalCalendar
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
  });
  res.json(calendar);
});

//Update a Calendar(Change title)
//require: title
//PATCH /api/calendar/:id
//Private, only owner can add participant
const updateTitle = asyncHandler(async (req, res) => {
  //Check if calendar exists
  const calendar = await Calendar.findById(req.params.id);
  console.log(req.params.id);
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
//DELETE /api/calendar/:id
//Private, only owner can delete calendar
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
  deleteCalendar,
};
