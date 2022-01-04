const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const CustomError = require('./CustomError');
const keys = require('../../../setting/keys');

function jwtVerify(req, res, next) {
  let token = req.headers.authorization;

  if (_.isEmpty(token) || !token.startsWith('Bearer ')) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
  }

  token = token.split(' ').pop();
  if (token) {
    jwt.verify(token, keys.secretKey, (error, decode) => {
      if (error) {
        throw new CustomError(StatusCodes.UNAUTHORIZED, error);
      } else {
        res.locals = decode;
        next();
      }
    });
  } else {
    throw new CustomError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

module.exports = {
  jwtVerify,
};
