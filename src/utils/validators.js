const Joi = require("joi");

// Registration input validation
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(128).required()
});

// Login input validation
const loginSchema = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
