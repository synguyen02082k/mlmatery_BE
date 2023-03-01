const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Enter yours full name!"],
  },
  age: {
    type: Number,
    required: [true, "Entre your age!"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("users", userSchema);
