const express = require("express");
const router = express.Router();
const authed = require("../middleware/authCheck");
const {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteTodos,
} = require("../controllers/todoController");

//Get all todo of one calendar
router.get("/", authed, getTodos);

//Get one specific todo
router.get("/:todoId", authed, getTodo);

//POST one todo
router.post("/", authed, createTodo);

//Delete a Todo
router.delete("/:todoId", authed, deleteTodo);

//Delete all Todo of one calendar
router.delete("/", authed, deleteTodos);

//Update a Todo(Change the description of one todo)
router.patch("/:todoId", authed, updateTodo);
module.exports = router;
