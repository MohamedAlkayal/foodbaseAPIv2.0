function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    info: err.info || "No additional info are available",
  });
}

module.exports = errorHandler;
