function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation error',
        details: error.errors || error.message,
      });
    }
  };
}

module.exports = { validate };
