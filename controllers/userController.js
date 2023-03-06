const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const userModel = require("../models/userModel");

// Login User
exports.getUsers = asyncErrorHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  const search = req.query.search;

  const query = search
    ? {
        [search?.keyword]: { $regex: search?.value },
      }
    : {};
  const listAllUser =await userModel.find(query);
  await userModel
    .find(query)
    .skip(perPage * page - perPage)
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
