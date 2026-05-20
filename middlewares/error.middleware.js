const { errorResponse } = require("../response");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error("[error]", err);
  }

  return errorResponse(statusCode, message, err.errors || null, res);
};

module.exports = errorHandler;
