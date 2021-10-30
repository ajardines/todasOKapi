const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT_ROUNDS } = require('../../../config');
const { ROLES } = require('../enumerations/roles');
const CustomError = require('../../common/middleware/CustomError');
const UserRepository = require('../repositories/UserRepository');
const keys = require('../../../setting/keys');

const UserService = module.exports;

UserService.validateEmailAndUsername = async (user) => {
  const userFound = await UserRepository.getUserByEmailOrUsername(user);

  if (!_.isEmpty(userFound)) {
    if (_.isEqual(user.email, userFound.email)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, `Ya existe un usuario registrado con el email ${user.email}`);
    } else if (_.isEqual(user.username, userFound.username)) {
      throw new CustomError(StatusCodes.BAD_REQUEST, `Ya existe un usuario registrado con el nombre de usuario ${user.username}`);
    }
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Ya existe un usuario registrado con esta información');
  }
};

UserService.createUser = async (user) => {
  await UserService.validateEmailAndUsername(user);
  const passHash = await bcrypt.hash(user.password, SALT_ROUNDS);

  const role = user.role || ROLES.USER;

  const userInserted = await UserRepository.createUser({ ...user, role, password: passHash });

  return { ...user, id: userInserted.id, password: passHash };
};

UserService.login = async (user) => {
  const username = user.username || user.email;
  const email = user.email || user.username;
  const userFound = await UserRepository.getUserByEmailOrUsername({ user, username, email });

  if (_.isEmpty(userFound)) {
    throw new CustomError(StatusCodes.NOT_FOUND, 'No se encontro el usuario con el email o nombre de usuario');
  }

  const validPassword = await bcrypt.compare(user.password, userFound.password);
  if (!validPassword) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, 'Usuario o contraseña incorrecta');
  }
  const payload = {
    userId: userFound.id,
    role: userFound.role,
  };
  const token = jwt.sign(payload, keys.secretKey);

  return token;
};
