class ErrorHandler extends Error {
    constructor(message, statusCode, error_code) {
        super(message);
        this.statusCode = statusCode
        this.code = error_code,
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;