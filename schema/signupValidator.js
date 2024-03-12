const Joi = require("joi");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{4,32}$/;

const signUpValidator = Joi.object({
  username: Joi.string().required().min(3).max(16).pattern(usernameRegex),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(passwordRegex, "strong password").required(),
});

module.exports = signUpValidator;
