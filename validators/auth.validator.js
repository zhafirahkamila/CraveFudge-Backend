const { body, oneOf } = require("express-validator");

const registerRules = [
  body("full_name")
    .exists({ checkFalsy: true }).withMessage("full_name is required")
    .bail()
    .isString().withMessage("full_name must be a string")
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("full_name must be 2-100 characters"),

  body("phone_number")
    .exists({ checkFalsy: true }).withMessage("phone_number is required")
    .bail()
    .isString().withMessage("phone_number must be a string")
    .trim()
    .matches(/^[0-9+\-\s]{8,20}$/).withMessage("phone_number must be 8-20 digits (may include + - and spaces)"),

  body("email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage("email must be a valid email"),

  body("password")
    .exists({ checkFalsy: true }).withMessage("password is required")
    .bail()
    .isString().withMessage("password must be a string")
    .isLength({ min: 6 }).withMessage("password must be at least 6 characters"),

  body("role")
    .not().exists().withMessage("role cannot be set on registration"),
];

const loginRules = [
  oneOf(
    [
      body("phone_number").exists({ checkFalsy: true }).isString(),
      body("email").exists({ checkFalsy: true }).isEmail(),
    ],
    { message: "Either phone_number or email is required" }
  ),
  body("password")
    .exists({ checkFalsy: true }).withMessage("password is required")
    .bail()
    .isString().withMessage("password must be a string"),
];

const refreshRules = [
  body("refresh_token")
    .exists({ checkFalsy: true }).withMessage("refresh_token is required")
    .bail()
    .isString().withMessage("refresh_token must be a string"),
];

module.exports = {
  registerRules,
  loginRules,
  refreshRules,
};
