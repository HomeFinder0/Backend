const Joi = require("joi");
const errorUpdate = require("./error.update.js");

exports.resetPasswordValidation = function (user) {
  const userSchema = Joi.object({
    password: Joi.string().min(8).required().max(50).trim(),
    confirmPass: Joi.valid(Joi.ref("password")).messages({
      "any.only": "Passwords do not match",
    }),
  }).unknown();
  let { error, value } = userSchema.validate(user);
  if (error) error = errorUpdate(error);
  return { value, error };
};
