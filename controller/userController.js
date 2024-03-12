require("dotenv").config;
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const CustomError = require("../utility/errorObject");
const updateUserValidator = require("../schema/updateUserValidator");

async function getProfile(req, res, next) {
  try {
    const userData = await User.findById(req.user._id, { password: 0 }).populate("groups").populate("orders");
    res.json({
      status: "success",
      data: userData,
    });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new CustomError("User not found", "The user does not exist", 404);
    }
    const updatedUser = req.body;
    const { error, value } = updateUserValidator.validate(updatedUser, { abortEarly: false });
    if (error) {
      const errArray = error.details.map((e) => e.message);
      throw new CustomError("Bad request", errArray, 400);
    }
    // Update user fields
    Object.assign(user, value);
    await user.save();
    res.json({
      status: "success",
      message: `${user.username} info is updated`,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function updatePassword(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new CustomError("User not found", "The user does not exist", 404);
    }
    const currentPasswordHash = user.password;
    const currentPasswordReq = req.body.current;
    const updatedPasswordReq = req.body.updated;
    const isAuth = await bcrypt.compare(currentPasswordReq, currentPasswordHash);
    if (!isAuth) {
      throw new CustomError("Unauthorized", "Invalid current Password input", 403);
    }
    const { error } = updateUserValidator.validate({ password: updatedPasswordReq }, { abortEarly: false });
    if (error) {
      const errArray = error.details.map((e) => e.message);
      throw new CustomError("Bad request", errArray, 400);
    }
    const updatedPasswordHash = await bcrypt.hash(updatedPasswordReq, 7);
    user.password = updatedPasswordHash;
    await user.save();
    res.json({
      status: "success",
      message: "Password is updated",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
};
