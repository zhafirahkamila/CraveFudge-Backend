const express = require("express");
const router = express.Router();

const db = require("../db").promise;
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const asyncHandler = require("../middlewares/async.middleware");
const response = require("../response");

router.get(
  "/admin/users",
  auth,
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const [rows] = await db.execute(
      "SELECT id, full_name, phone_number, email, role, is_active, created_at FROM users ORDER BY created_at DESC"
    );
    response(200, rows, "All users", res);
  })
);

module.exports = router;
