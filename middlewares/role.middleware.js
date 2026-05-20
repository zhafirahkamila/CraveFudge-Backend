const { errorResponse } = require("../response");

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return errorResponse(401, "Unauthorized", null, res);
  }
  if (!allowedRoles.includes(req.user.role)) {
    return errorResponse(403, "Forbidden: insufficient permissions", null, res);
  }
  next();
};

module.exports = requireRole;
