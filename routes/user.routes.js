const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const asyncHandler = require("../middlewares/async.middleware");
const validate = require("../middlewares/validate.middleware");
const response = require("../response");

const userController = require("../controllers/user.controller");
const {
  updateProfileRules,
  changePasswordRules,
} = require("../validators/user.validator");

router.get("/user/profile", auth, requireRole("user", "admin"), (req, res) => {
  response(200, req.user, "Profile fetched", res);
});

router.patch(
  "/user/profile",
  auth,
  requireRole("user", "admin"),
  updateProfileRules,
  validate,
  asyncHandler(userController.updateProfile)
);

router.patch(
  "/user/password",
  auth,
  requireRole("user", "admin"),
  changePasswordRules,
  validate,
  asyncHandler(userController.changePassword)
);

module.exports = router;
