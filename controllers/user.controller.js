const bcrypt = require("bcryptjs");
const { catchAsync, AppError, sendResponse } = require("../helpers/utils");
const User = require("../models/User");
const { all } = require("../routes");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  let { name, email, password } = req.body;
  let user = await User.findOne({ email });
  console.log(user);
  if (user) {
    throw new AppError(409, "User already exists", "Register Error");
  }
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  user = await User.create({
    name,
    email,
    password,
  });

  const accessToken = user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.loginEmailPassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, "+password");
  if (!user) {
    throw new AppError(400, "User not found", "Login Error");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(400, "invalid credentials", "Login Error");
  }
  const accessToken = user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "successful"
  );
});

userController.getAllUsers = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const filterCondition = [{ isDeleted: false }];
  const allow = ["name", "email"];

  allow.forEach((field) => {
    if (filter[field] !== undefined) {
      filterCondition.push({
        [field]: { $regex: filter[field], $options: "i" },
      });
    }
  });
  const filterCritera = filterCondition.length ? { $and: filterCondition } : {};

  const count = await User.countDocuments(filterCritera);
  const totalPage = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let userList = await User.find(filterCritera)
    .sort({ createAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, { userList, totalPage }, null, "successful");
});

userController.getSingleUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log("id", id);
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, "User not found", "Get current user error");
  }
  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get single user by id successful"
  );
});

userController.getCurrentUserProfile = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let currentUser = await User.findById(currentUserId);
  if (!currentUser) {
    throw new AppError(404, "User Not Found", "Get current user error");
  }
  return sendResponse(
    res,
    200,
    true,
    currentUser,
    null,
    "Get current user Successful"
  );
});

userController.updateCurrentUser = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  let user = await User.findById(currentUserId);
  if (!user) {
    throw new AppError(404, "User Not Found", "Get current user error");
  }
  const allows = ["name", "city", "aboutMe"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });
  await user.save();
  return sendResponse(res, 200, true, user, null, "successful");
});

userController.deactivateCurrentUser = catchAsync(async (req, res, next) => {
  const { currentUserId } = req;
  //delete password confirm
  await User.findByIdAndUpdate(
    currentUserId,
    { isDeleted: true },
    { new: true }
  );
  return sendResponse(res, 200, {}, null, "Deactivate user successful");
});
module.exports = userController;
