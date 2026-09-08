const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

/**
 * Middleware that reads express-validator results and short-circuits with 422
 * if there are any validation errors, so controllers stay clean.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 'Validation failed', 422, errors.array());
  }
  next();
};

module.exports = validate;
