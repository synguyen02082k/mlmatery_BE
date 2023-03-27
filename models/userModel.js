const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Enter yours full name!"],
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: [8, 'Mật khẩu ít nhất 8 chữ cái'],
    select: false,
  },
  age: {
    type: Number,
    required: [true, "Enter your age!"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  DOB: {
    type: Date,
  },
  division: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("users", userSchema);
