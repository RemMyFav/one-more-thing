const asyncHandler = require("express-async-handler");
const Todo = require("../models/Todo");
const pCalendar = require("../models/Personal");
const gCalendar = require("../models/Group");
const {
  placeMailing,
  removeMailing,
  updateMaling,
  removeAllMailing,
  emptyMailing,
  checkMailing,
} = require("./mail");

//Get all todo of one calendar
//
const getTodos = asyncHandler(async (req, res) => {
  //This calendar is a group calendar
  if (req.body.type === "GROUP") {
    const gcalendar = await gCalendar.findById(req.body.calendarId);
    //Check if user is owner or participant of this group calendar
    if (
      gcalendar.owner.toString() !== req.user._id.toString() &&
      !gcalendar.participant.includes(req.user._id)
    ) {
      res.status(401);
      throw new Error("Not authorized in group calendar");
    }
  }
  //This calendar is a personal calendar
  else if (req.body.type === "PERSONAL") {
    const pcalendar = await pCalendar.findById(req.body.calendarId);
    //Check if user is owner of this personal calendar
    if (pcalendar.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized in personal calendar");
    }
  } else {
    res.status(400);
    throw new Error("BAD REQUEST");
  }
  const todos = await Todo.find({ calendarId: req.body.calendarId });
  res.json(todos);
});

//get one specific todo
const getTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.todoId);
  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }
  //This calendar is a group calendar
  if (req.body.type === "GROUP") {
    const gcalendar = await gCalendar.findById(req.body.calendarId);
    //Check if user is owner or participant of this group calendar
    if (
      gcalendar.owner.toString() !== req.user._id.toString() &&
      !gcalendar.participant.includes(req.user._id)
    ) {
      res.status(401);
      throw new Error("Not authorized in group calendar");
    }
    //Check if user is owner or participant of this group calendar
    if (gcalendar._id.toString() !== todo.calendarId.toString()) {
      res.status(404);
      throw new Error("Todo does not belong to this group calendar");
    }
  }
  //This calendar is a personal calendar
  else if (req.body.type === "PERSONAL") {
    const pcalendar = await pCalendar.findById(req.body.calendarId);
    //Check if user is owner of this personal calendar
    if (pcalendar.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized in personal calendar");
    }
    //Check if todo belongs to this personal calendar
    if (pcalendar._id.toString() !== todo.calendarId.toString()) {
      res.status(404);
      throw new Error("Todo does not belong to this group calendar");
    }
  } else {
    console.log("????????");
    res.status(400);
    throw new Error("BAD REQUEST");
  }
  res.json(todo);
});

//Post one todo to a calendar
//require: title, start, end
//POST /api/personalCalendar/calendarId/todo OR
//POST /api/groupCalendar/calendarId/todo
//Private only owner of current calendar can create todo in personal
//Private only owner and particpants can create todo in group
const createTodo = asyncHandler(async (req, res) => {
  let participant = [];
  //Check required fields
  if (!req.body.title || !req.body.start || !req.body.end) {
    res.status(400);
    throw new Error("Title, start and end is required");
  }
  //This calendar is a group calendar
  if (req.body.type === "GROUP") {
    const gcalendar = await gCalendar.findById(req.body.calendarId);
    participant = gcalendar.participant;
    //Check if user is owner or participant of this group calendar
    if (
      gcalendar.owner.toString() !== req.user._id.toString() &&
      !gcalendar.participant.includes(req.user._id)
    ) {
      res.status(401);
      throw new Error("Not authorized in group calendar");
    }
  }
  //This calendar is a personal calendr
  else if (req.body.type === "PERSONAL") {
    const pcalendar = await pCalendar.findById(req.body.calendarId);
    //Check if user is owner of this personal calendar
    if (pcalendar.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized in personal calendar");
    }
  } else {
    res.status(400);
    throw new Error("BAD REQUEST");
  }
  //Create new todo
  const todo = new Todo({
    start: req.body.start,
    end: req.body.end,
    title: req.body.title,
    owner: req.user._id,
    calendarId: req.body.calendarId,
  });
  const newTodo = await todo.save();
  placeMailing(newTodo);
  res.json(newTodo);
});

//Update a todo
//require: title, start, end
//PATCH /api/personalCalendar/calendarId/todo/todoId OR
//PATCH /api/groupCalendar/calendarId/todo/todoId
//Private only owner of current calendar can update todo in personal
//Private only owner and particpants can update todo in group
const updateTodo = asyncHandler(async (req, res) => {
  let participant = [];
  //Check required fields
  if (!req.body.title || !req.body.start || !req.body.end) {
    res.status(400);
    throw new Error("Title, start and end is required");
  }
  //Check if todo exist
  const todo = await Todo.findById(req.params.todoId);
  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }
  //This calendar is a group calendar
  if (req.body.type === "GROUP") {
    const gcalendar = await gCalendar.findById(req.body.calendarId);
    participant = gcalendar.participant;
    //Check if user is owner or participant of this group calendar
    if (
      gcalendar.owner.toString() !== req.user._id.toString() &&
      !gcalendar.participant.includes(req.user._id)
    ) {
      res.status(401);
      throw new Error("Not authorized in group calendar");
    }
    //Check if todo belongs to this group calendar
    if (gcalendar._id.toString() !== todo.calendarId.toString()) {
      res.status(404);
      throw new Error("Todo does not belong to this group calendar");
    }
  }
  //This calendar is a personal calendar
  else if (req.body.type === "PERSONAL") {
    const pcalendar = await pCalendar.findById(req.body.calendarId);
    //Check if user is owner of this personal calendar
    if (pcalendar.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized in personal calendar");
    }
    //Check if user is owner or participant of this personal calendar
    if (pcalendar._id.toString() !== todo.calendarId.toString()) {
      res.status(404);
      throw new Error("Todo does not belong to this group calendar");
    }
  } else {
    res.status(400);
    throw new Error("BAD REQUEST");
  }
  const newTodo = await Todo.updateOne(
    { _id: req.params.todoId },
    {
      $set: {
        start: req.body.start,
        end: req.body.end,
        title: req.body.title,
      },
    }
  );
  const updatedTodo = await Todo.findById(req.params.todoId);
  updateMaling(updatedTodo);
  res.json(newTodo);
});

//delete a todo
const deleteTodo = asyncHandler(async (req, res) => {
  //Check if todo exist
  const todo = await Todo.findById(req.params.todoId);
  if (!todo) {
    res.status(404);
    throw new Error("Todo not found");
  }
  //This calendar is a group calendar
  if (req.body.type === "GROUP") {
    const gcalendar = await gCalendar.findById(req.body.calendarId);
    // console.log(gcalenda);
    //Check if user is owner or participant of this group calendar
    if (
      gcalendar.owner.toString() !== req.user._id.toString() &&
      !gcalendar.participant.includes(req.user._id)
    ) {
      res.status(401);
      throw new Error("Not authorized in group calendar");
    }
    //Check if todo belong to this group calendar
    if (gcalendar._id.toString() !== todo.calendarId.toString()) {
      res.status(404);
      throw new Error("Todo does not belong to this group calendar");
    }
  }
  //This calendar is a personal calendar
  else if (req.body.type === "PERSONAL") {
    const pcalendar = await pCalendar.findById(req.body.calendarId);
    //Check if user is owner of this personal calendar
    if (pcalendar.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized in personal calendar");
    }
    //Check if todo belong to this personal calendar
    if (pcalendar._id.toString() !== todo.calendarId.toString()) {
      res.status(404);
      throw new Error("Todo does not belong to this group calendar");
    }
  } else {
    res.status(400);
    throw new Error("BAD REQUEST");
  }
  const deleted = await Todo.deleteOne({ _id: req.params.todoId });
  removeMailing(todo);
  res.json(deleted);
});

//delete all todo of one calendar
const deleteTodos = asyncHandler(async (req, res) => {
  //This calendar is a group calendar
  if (req.body.type === "GROUP") {
    const gcalendar = await gCalendar.findById(req.body.calendarId);
    //Check if user is owner or participant of this group calendar
    if (
      gcalendar.owner.toString() !== req.user._id.toString() &&
      !gcalendar.participant.includes(req.user._id)
    ) {
      res.status(401);
      throw new Error("Not authorized in group calendar");
    }
  }
  //This calendar is a personal calendar
  else if (req.body.type === "PERSONAL") {
    const pcalendar = await pCalendar.findById(req.body.calendarId);
    //Check if user is owner of this personal calendar
    if (pcalendar.owner.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized in personal calendar");
    }
  } else {
    res.status(400);
    throw new Error("BAD REQUEST");
  }
  const deleted = await Todo.deleteMany({ calendarId: req.body.calendarId });
  removeAllMailing({ calendarId: req.body.calendarId });
  res.json(deleted);
});

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodos,
};
