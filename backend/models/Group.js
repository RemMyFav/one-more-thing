const mongoose = require("mongoose");

const GCalendarSchema = mongoose.Schema({
  title: { type: String, required: [true, "Missing: title is required"] },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Missing: owner is required"],
    ref: "Users",
  },
  createDate: {
    type: Date,
    required: [true, "Missing: createDate is required"],
  },
  participant: { type: [mongoose.Schema.Types.ObjectId], ref: "Users" },
});

module.exports = mongoose.model("Group", GCalendarSchema);
