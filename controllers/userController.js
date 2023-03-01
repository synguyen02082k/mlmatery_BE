const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const userModel = require("../models/userModel");

// Login User
exports.getUsers = asyncErrorHandler(async (req, res, next) => {
  let page = req.query.page || 1;
  let perPage = req.query.perPage || 10;

  await userModel
    .find()
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, users) => {
      userModel.countDocuments((err, count) => {
        if (err) return next(err);
        res.status(200).json({
          success: true,
          users,
          page: page,
          perPage: perPage,
          totalPage: Math.floor(count / perPage),
        });
      });
    });
});

exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const users = await userModel.create({
    age: 20,
    fullName: "Sy",
  });

  res.status(200).json({
    success: true,
    users,
  });
});
