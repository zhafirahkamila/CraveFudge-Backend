const express = require("express");
const router = express.Router();

const authController = require("../../controllers/auth.controller");
const asyncHandler = require("../../middlewares/async.middleware");
const validate = require("../../middlewares/validate.middleware");
const auth = require("../../middlewares/auth.middleware");
const {
  registerRules,
  loginRules,
  refreshRules,
} = require("../../validators/auth.validator");

router.post("/auth/register", registerRules, validate, asyncHandler(authController.register));
router.post("/auth/login", loginRules, validate, asyncHandler(authController.login));
router.post("/auth/refresh", refreshRules, validate, asyncHandler(authController.refresh));
router.post("/auth/logout", auth, asyncHandler(authController.logout));
router.get("/auth/me", auth, asyncHandler(authController.me));

module.exports = router;
