class CustomError extends Error {
  constructor(message, info, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.info = info;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
