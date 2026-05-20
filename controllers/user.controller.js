const bcrypt = require("bcryptjs");
const db = require("../db").promise;
const response = require("../response");
const { errorResponse } = require("../response");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

const ALLOWED_PROFILE_FIELDS = ["full_name", "phone_number", "email"];

const sanitizeUser = (user) => ({
  id: user.id,
  full_name: user.full_name,
  phone_number: user.phone_number,
  email: user.email,
  role: user.role,
  is_active: user.is_active,
});

const updateProfile = async (req, res) => {
  const updates = {};
  for (const key of ALLOWED_PROFILE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(req.body, key)) continue;
    const raw = req.body[key];
    if (key === "email") {
      updates.email = raw === null || raw === "" ? null : String(raw).trim();
    } else if (typeof raw === "string") {
      updates[key] = raw.trim();
    } else {
      updates[key] = raw;
    }
  }

  if (Object.keys(updates).length === 0) {
    return errorResponse(
      422,
      "Validation failed",
      [{ field: "_", message: "at least one of full_name, phone_number, email must be provided" }],
      res
    );
  }

  const checkPhone = updates.phone_number ?? null;
  const checkEmail = updates.email ?? null;

  if (checkPhone || checkEmail) {
    const [conflicts] = await db.execute(
      `SELECT id, phone_number, email
       FROM users
       WHERE id <> ?
         AND ((? IS NOT NULL AND phone_number = ?)
           OR (? IS NOT NULL AND email = ?))`,
      [req.user.id, checkPhone, checkPhone, checkEmail, checkEmail]
    );

    if (conflicts.length) {
      const errors = [];
      for (const row of conflicts) {
        if (checkPhone && row.phone_number === checkPhone) {
          errors.push({ field: "phone_number", message: "phone_number already in use" });
        }
        if (checkEmail && row.email === checkEmail) {
          errors.push({ field: "email", message: "email already in use" });
        }
      }
      return errorResponse(409, "Conflict", errors, res);
    }
  }

  const setClauses = [];
  const params = [];
  for (const key of ALLOWED_PROFILE_FIELDS) {
    if (key in updates) {
      setClauses.push(`${key} = ?`);
      params.push(updates[key]);
    }
  }
  params.push(req.user.id);

  await db.execute(
    `UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`,
    params
  );

  const [rows] = await db.execute(
    "SELECT id, full_name, phone_number, email, role, is_active FROM users WHERE id = ?",
    [req.user.id]
  );

  return response(200, { user: sanitizeUser(rows[0]) }, "Profile updated", res);
};

const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;

  const [rows] = await db.execute(
    "SELECT id, password FROM users WHERE id = ? LIMIT 1",
    [req.user.id]
  );

  if (!rows.length) {
    return errorResponse(404, "User not found", null, res);
  }

  const match = await bcrypt.compare(current_password, rows[0].password);
  if (!match) {
    return errorResponse(400, "current_password is incorrect", null, res);
  }

  if (new_password === current_password) {
    return errorResponse(
      422,
      "Validation failed",
      [{ field: "new_password", message: "new_password must differ from current_password" }],
      res
    );
  }

  const newHash = await bcrypt.hash(new_password, SALT_ROUNDS);

  await db.execute(
    "UPDATE users SET password = ?, refresh_token = NULL WHERE id = ?",
    [newHash, req.user.id]
  );

  return response(200, null, "Password updated", res);
};

module.exports = {
  updateProfile,
  changePassword,
};
