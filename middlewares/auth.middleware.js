const { verifyAccessToken } = require("../utils/jwt");
const { errorResponse } = require("../response");
const db = require("../db").promise;

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return errorResponse(401, "Missing or invalid Authorization header", null, res);
    }

    const token = header.slice(7).trim();
    if (!token) {
      return errorResponse(401, "Missing access token", null, res);
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return errorResponse(401, "Token expired", null, res);
      }
      return errorResponse(401, "Invalid token", null, res);
    }

    const [rows] = await db.execute(
      "SELECT id, full_name, phone_number, email, role, is_active FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length) {
      return errorResponse(401, "User no longer exists", null, res);
    }

    const user = rows[0];
    if (!user.is_active) {
      return errorResponse(403, "Account is inactive", null, res);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
