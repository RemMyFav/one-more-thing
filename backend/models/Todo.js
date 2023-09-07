const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
  start: { type: Date, required: [true, "Missing: start is required"] },
  end: { type: Date, required: [true, "Missing: end is required"] },
  title: { type: String, required: [true, "Missing: title is required"] },
  // description: {type: String, required: [true, 'Missing: discription is required']},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Missing: owner is required"],
    ref: "Users",
  },
  calendarId: {
    type: String,
    required: [true, "Missing: calendarId is required"],
  },
});

module.exports = mongoose.model("Todos", TodoSchema);
