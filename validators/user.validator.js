const { body } = require("express-validator");

const updateProfileRules = [
  body("full_name")
    .optional()
    .isString().withMessage("full_name must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage("full_name must be 2-100 characters"),

  body("phone_number")
    .optional()
    .isString().withMessage("phone_number must be a string")
    .bail()
    .trim()
    .matches(/^[0-9+\-\s]{8,20}$/).withMessage("phone_number must be 8-20 digits (may include + - and spaces)"),

  body("email")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true;
      if (typeof value !== "string") {
        throw new Error("email must be a string or null");
      }
      return true;
    })
    .bail()
    .if((value) => value !== null)
    .trim()
    .isEmail().withMessage("email must be a valid email"),

  body("role")
    .not().exists().withMessage("role cannot be updated here"),
  body("is_active")
    .not().exists().withMessage("is_active cannot be updated here"),
  body("password")
    .not().exists().withMessage("use /user/password to change password"),
  body("id")
    .not().exists().withMessage("id cannot be updated"),
];

const changePasswordRules = [
  body("current_password")
    .exists({ checkFalsy: true }).withMessage("current_password is required")
    .bail()
    .isString().withMessage("current_password must be a string"),

  body("new_password")
    .exists({ checkFalsy: true }).withMessage("new_password is required")
    .bail()
    .isString().withMessage("new_password must be a string")
    .isLength({ min: 6 }).withMessage("new_password must be at least 6 characters")
    .custom((value, { req }) => {
      if (value === req.body.current_password) {
        throw new Error("new_password must differ from current_password");
      }
      return true;
    }),
];

module.exports = {
  updateProfileRules,
  changePasswordRules,
};
