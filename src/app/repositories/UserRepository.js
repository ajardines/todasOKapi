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

  const userInserted = await db('users')
    .insert(insertUser);

  return userInserted;
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
  userFound.lastName = userFound.last_name;

  return userFound;
};
