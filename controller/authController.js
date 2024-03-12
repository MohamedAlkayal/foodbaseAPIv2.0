require("dotenv").config;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const CustomError = require("../utility/errorObject");
const signupValidator = require("../schema/signupValidator");

async function signup(req, res, next) {
  try {
    const user = await req.body;
    const { error, value } = signupValidator.validate(user, { abortEarly: false });
    if (!error) {
      value.password = await bcrypt.hash(value.password, 7);
      await User.create(value);
      res.status(200).json({
        message: `${value.username} registerd`,
        data: {
          username: value.username,
          email: value.email,
        },
      });
    } else {
      const errArray = [];
      error.details.forEach((e) => errArray.push(e.message));
      throw CustomError("Bad request", errArray, 400);
    }
  } catch (err) {
    if (err.message.split(" ")[0] == "E11000") {
      next(new CustomError("User Already Exists", err.message, 409));
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError("Bad request", "Invalid credentials", 400);
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const accessToken = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET
      );
      res.json({
        accessToken: `bearer ${accessToken}`,
      });
    } else {
      throw new CustomError("Bad request", "Invalid credentials", 400);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  login,
};
