const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  const code = err.code || null;

  // mongodb id error
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = ` ${Object.keys(err.keyValue)} đã tồn tại`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.code === "jwt malformed") {
    const message = "Invalid token!";
    err = new ErrorHandler(message, 401);
  }

  // jwt expire error
  if (err.code === "jwt expired") {
    const message = "JWT đã hết hạn";
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    code,
  });
};
