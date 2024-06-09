const Joi = require("joi");

exports.checkUserDataValidator = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  name: Joi.string(),
  photo: Joi.string(),
  previousSessionId: Joi.string().allow(null),
}).options({ abortEarly: false, convert: false });
