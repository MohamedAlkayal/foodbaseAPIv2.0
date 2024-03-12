const jwt = require("jsonwebtoken");
require("dotenv").config();
const CustomError = require("../utility/errorObject");

function authorizer(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      throw new CustomError("Unauthorized", "Make sure to login then try again", 401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw new CustomError("Unauthorized", "Make sure to login then try again", 401);
      }
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
}

module.exports = authorizer;
