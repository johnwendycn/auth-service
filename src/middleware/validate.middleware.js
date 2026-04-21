const Joi = require('joi');
const { BadRequest } = require('../utils/errors');

const validate = (schema, source = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) return next(new BadRequest(error.details.map(d => d.message).join('; ')));
  req[source] = value;
  next();
};

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    full_name: Joi.string().min(1).max(255).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  forgotPassword: Joi.object({ email: Joi.string().email().required() }),
  resetPassword: Joi.object({ new_password: Joi.string().min(8).max(128).required() }),
  refresh: Joi.object({ refresh_token: Joi.string().required() }),
  updateMe: Joi.object({ full_name: Joi.string().min(1).max(255).required() }),
  changePassword: Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(8).max(128).required(),
  }),
  setActive: Joi.object({ is_active: Joi.boolean().required() }),
};

module.exports = { validate, schemas };
