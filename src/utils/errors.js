class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
class BadRequest extends AppError { constructor(m='Bad request'){super(m,400,'BAD_REQUEST');} }
class Unauthorized extends AppError { constructor(m='Unauthorized'){super(m,401,'UNAUTHORIZED');} }
class Forbidden extends AppError { constructor(m='Forbidden'){super(m,403,'FORBIDDEN');} }
class NotFound extends AppError { constructor(m='Not found'){super(m,404,'NOT_FOUND');} }
class Conflict extends AppError { constructor(m='Conflict'){super(m,409,'CONFLICT');} }

module.exports = { AppError, BadRequest, Unauthorized, Forbidden, NotFound, Conflict };
