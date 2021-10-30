const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const CustomError = require('./CustomError');
const keys = require('../../../setting/keys');

function jwtVerify(req, res, next) {
  let token = req.headers.authorization;

  if (_.isEmpty(token) || !token.startsWith('Bearer ')) {
    console.log('Primer if ###');
    throw new CustomError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
  }

  token = token.split(' ').pop();
  console.log('### Token', token);
  if (token) {
    jwt.verify(token, keys.secretKey, (error, decode) => {
      if (error) {
        console.log('Segundo if error ###');
        throw new CustomError(StatusCodes.UNAUTHORIZED, error);
      } else {
        req.decode = decode;
        next();
      }
    });
  } else {
    console.log('Segundo else ###');
    throw new CustomError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

module.exports = {
  jwtVerify,
};
