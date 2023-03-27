const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");

// Login User
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Vui lòng nhập email và mật khẩu", 400));
  }
  if (validator.validate(email) == false) {
    return next(new ErrorHandler("Email không đúng định dạng!", 400));
  }
  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Email không tồn tại", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Bạn đã nhập mật khẩu sai", 400));
  }

  const accessToken = user.getJWTToken();
  res.status(200).json({
    success: true,
    user,
    accessToken,
  });
});

exports.refreshToken = asyncErrorHandler(async (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  const token = authorization && authorization.split(" ").pop();
  const decodedData = jwt.decode(token, process.env.JWT_SECRET);
  const user = await userModel.findById(decodedData.id);
  const accessToken = user.getJWTToken();
  res.status(200).json({
    success: true,
    user,
    accessToken,
  });
});

exports.getUsers = asyncErrorHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  const search = req.query.search;
  const sort = req.query.sort ?? {};
  const query = search
    ? {
        [search?.keyword]: { $regex: search?.value },
      }
    : {};
  const listAllUser = await userModel.find(query);
  await userModel
    .find(query)
    .skip(perPage * page - perPage)
    .sort(sort)
    .limit(perPage)
    .exec((err, users) => {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        users,
        page: page,
        perPage: perPage,
        totalPage: 0,
        totalCount: listAllUser.length,
      });
    });
});

exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.id;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const age = new Date().getFullYear() - new Date(req.body.DOB).getFullYear();
  const user = await userModel.create({
    age,
    ...req.body,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  const userId = req.params.id;
  const data = { ...req.body };
  if (!!req.body.DOB) {
    data.age = new Date().getFullYear() - new Date(req.body.DOB).getFullYear();
  }
  const user = await userModel.findByIdAndUpdate(userId, {
    ...data,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;

  const user = await userModel.findById(id);
  await user.remove();
  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteUsers = asyncErrorHandler(async (req, res, next) => {
  const ids = req.params.ids.split(",");
  await userModel.deleteMany({
    _id: { $in: ids },
  });

  res.status(200).json({
    success: true,
  });
});
