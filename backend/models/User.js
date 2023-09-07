const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Missing: username is required"],
    unique: [true, "Username already exists"],
  },
  password: { type: String },
  email: { type: String, required: [true, "Missing: email is required"] },
});

module.exports = mongoose.model("Users", UserSchema);
