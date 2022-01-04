const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SALT_ROUNDS } = require('../../../config');
const { ROLES } = require('../enumerations/roles');
const CustomError = require('../../common/middleware/CustomError');
const UserRepository = require('../repositories/UserRepository');
const keys = require('../../../setting/keys');
const EmailService = require('./EmailService');

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

  const payload = {
    userId: userInserted.id,
    role: userInserted.role,
  };
  const token = jwt.sign(payload, keys.secretKey, { expiresIn: '10h' });
  EmailService.sendValidationMail(userInserted, token);

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

UserService.validateEmail = async (user) => {
  const userUpdated = await UserRepository.validateEmail(user);

  if (_.isEmpty(userUpdated)) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Ocurrió un error el email no pudo ser validado');
  }

  return userUpdated;
};

UserService.getUserById = async (user) => {
  const userFound = await UserRepository.getUserById(user);

  if (_.isEmpty(userFound)) {
    throw new CustomError(StatusCodes.NOT_FOUND, 'No se encontró el usuario');
  }

  return _.omit(userFound, ['id', 'email', 'password']);
};

UserService.forgotPassword = async (user) => {
  const userFound = await UserRepository.getUserByEmailOrUsername(user);

  const payload = {
    userId: userFound.id,
    role: userFound.role,
  };
  const token = jwt.sign(payload, keys.secretKey, { expiresIn: '10h' });
  EmailService.sendForgotPassword(userFound, token);

  return _.omit(userFound, ['id', 'email', 'password']);
};

UserService.updatePassword = async (user) => {
  const passHash = await bcrypt.hash(user.password, SALT_ROUNDS);
  const userUpdated = await UserRepository.updatePassword({ ...user, password: passHash });

  if (_.isEmpty(userUpdated)) {
    throw new CustomError(StatusCodes.BAD_REQUEST, 'Ocurrio un error al actualizar la contraseña');
  }

  return _.omit(userUpdated, ['id', 'email', 'password']);
};
