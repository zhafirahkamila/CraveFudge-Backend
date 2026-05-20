const { validationResult } = require("express-validator");
const { errorResponse } = require("../response");

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path || e.param,
    message: e.msg,
  }));

  return errorResponse(422, "Validation failed", errors, res);
};

module.exports = validate;
