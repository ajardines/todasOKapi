const { StatusCodes } = require('http-status-codes');

module.exports = {
  handler: (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(statusCode).send({ error: err.message });
    next();
  },
};
