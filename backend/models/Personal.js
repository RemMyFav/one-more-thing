const mongoose = require("mongoose");

const PCalendarSchema = mongoose.Schema({
  title: { type: String, required: [true, "Missing: title is required"] },
  owner: { type: String, required: [true, "Missing: title is required"] },
  createDate: {
    type: Date,
    required: [true, "Missing: createDate is required"],
  },
});

module.exports = mongoose.model("Personal", PCalendarSchema);
