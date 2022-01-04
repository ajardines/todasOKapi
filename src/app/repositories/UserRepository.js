const camelcaseKeys = require('camelcase-keys');
const _ = require('lodash');
const db = require('../../common/utils/db');

const UserRepository = module.exports;

UserRepository.createUser = async (user) => {
  const insertUser = {
    name: user.name,
    last_name: user.lastName,
    username: user.username,
    password: user.password,
    email: user.email,
    role: user.role,
  };

  const userIdInserted = await db('users')
    .insert(insertUser);

  return { ...user, id: userIdInserted.pop() };
};

UserRepository.getUserByEmailOrUsername = async (user) => {
  const data = await db('users')
    .select('*')
    .from('users')
    .where('users.email', user.email)
    .orWhere('users.username', user.username);

  const userFound = data.pop();
  if (_.isEmpty(userFound)) {
    return {};
  }
  return camelcaseKeys(userFound);
};

UserRepository.getUserById = async (user) => {
  const data = await db('users')
    .select('*')
    .from('users')
    .where('users.id', user.id);

  const userFound = data.pop();
  if (_.isEmpty(userFound)) {
    return {};
  }
  return camelcaseKeys(userFound);
};

UserRepository.validateEmail = async (user) => {
  const data = await db('users')
    .update('is_validated_email', true)
    .where('users.id', user.id);

  if (!data) {
    return {};
  }

  return user;
};

UserRepository.updatePassword = async (user) => {
  const data = await db('users')
    .update('password', user.password)
    .where('users.id', user.id);

  if (!data) {
    return {};
  }

  return user;
};
