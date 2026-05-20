const bcrypt = require("bcryptjs");
const db = require("../db").promise;
const response = require("../response");
const { errorResponse } = require("../response");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

const sanitizeUser = (user) => ({
  id: user.id,
  full_name: user.full_name,
  phone_number: user.phone_number,
  email: user.email,
  role: user.role,
  is_active: user.is_active,
});

const register = async (req, res) => {
  const { full_name, phone_number, email, password } = req.body;
  const normalizedEmail = email || null;

  const [existing] = await db.execute(
    "SELECT id, phone_number, email FROM users WHERE phone_number = ? OR (? IS NOT NULL AND email = ?)",
    [phone_number, normalizedEmail, normalizedEmail]
  );

  if (existing.length) {
    const conflicts = [];
    for (const row of existing) {
      if (row.phone_number === phone_number) {
        conflicts.push({ field: "phone_number", message: "phone_number already registered" });
      }
      if (normalizedEmail && row.email === normalizedEmail) {
        conflicts.push({ field: "email", message: "email already registered" });
      }
    }
    return errorResponse(409, "User already exists", conflicts, res);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await db.execute(
    "INSERT INTO users (full_name, phone_number, email, password) VALUES (?, ?, ?, ?)",
    [full_name, phone_number, normalizedEmail, passwordHash]
  );

  const userId = result.insertId;
  const access_token = signAccessToken({ id: userId, role: "user" });
  const refresh_token = signRefreshToken({ id: userId });

  await db.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [refresh_token, userId]);

  const [rows] = await db.execute(
    "SELECT id, full_name, phone_number, email, role, is_active FROM users WHERE id = ?",
    [userId]
  );

  return response(
    201,
    { user: sanitizeUser(rows[0]), access_token, refresh_token },
    "Registration successful",
    res
  );
};

const login = async (req, res) => {
  const { phone_number, email, password } = req.body;

  const [rows] = await db.execute(
    "SELECT id, full_name, phone_number, email, password, role, is_active FROM users WHERE phone_number = ? OR (? IS NOT NULL AND email = ?) LIMIT 1",
    [phone_number || null, email || null, email || null]
  );

  if (!rows.length) {
    return errorResponse(401, "Invalid credentials", null, res);
  }

  const user = rows[0];

  if (!user.is_active) {
    return errorResponse(403, "Account is inactive", null, res);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return errorResponse(401, "Invalid credentials", null, res);
  }

  const access_token = signAccessToken({ id: user.id, role: user.role });
  const refresh_token = signRefreshToken({ id: user.id });

  await db.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [refresh_token, user.id]);

  return response(
    200,
    { user: sanitizeUser(user), access_token, refresh_token },
    "Login successful",
    res
  );
};

const refresh = async (req, res) => {
  const { refresh_token } = req.body;

  let decoded;
  try {
    decoded = verifyRefreshToken(refresh_token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(401, "Refresh token expired", null, res);
    }
    return errorResponse(401, "Invalid refresh token", null, res);
  }

  const [rows] = await db.execute(
    "SELECT id, role, is_active, refresh_token FROM users WHERE id = ? LIMIT 1",
    [decoded.id]
  );

  if (!rows.length) {
    return errorResponse(401, "User not found", null, res);
  }

  const user = rows[0];

  if (!user.is_active) {
    return errorResponse(403, "Account is inactive", null, res);
  }

  if (!user.refresh_token || user.refresh_token !== refresh_token) {
    return errorResponse(401, "Refresh token revoked", null, res);
  }

  const access_token = signAccessToken({ id: user.id, role: user.role });

  return response(200, { access_token }, "Token refreshed", res);
};

const logout = async (req, res) => {
  await db.execute("UPDATE users SET refresh_token = NULL WHERE id = ?", [req.user.id]);
  return response(200, null, "Logout successful", res);
};

const me = async (req, res) => {
  return response(200, sanitizeUser(req.user), "Current user", res);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
