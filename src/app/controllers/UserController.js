const EmailService = require('../services/EmailService');
const UserService = require('../services/UserService');

const UserController = module.exports;

UserController.createUser = async (req, res, next) => {
  const user = req.body;

  return UserService.createUser(user)
    .then((userCreated) => res.send(userCreated))
    .catch(next);
};

UserController.login = (req, res, next) => {
  const user = req.body;

  return UserService.login(user)
    .then((token) => res.json(token))
    .catch(next);
};

UserController.validateEmail = (req, res, next) => {
  const { userId: id } = res.locals;

  return UserService.validateEmail({ id })
    .then((userUpdated) => res.send(userUpdated))
    .catch(next);
};

UserController.getUser = async (req, res, next) => {
  const { userId: id } = res.locals;

  return UserService.getUserById({ id })
    .then((userFound) => res.send(userFound))
    .catch(next);
};

UserController.forgotPassword = async (req, res, next) => {
  const { email, email: username } = req.body;

  return UserService.forgotPassword({ email, username })
    .then((user) => res.send(user))
    .catch(next);
};

UserController.updatePassword = async (req, res, next) => {
  const { userId: id } = res.locals;
  const { password } = req.body;

  return UserService.updatePassword({ id, password })
    .then((userFound) => res.send(userFound))
    .catch(next);
};

// Test
UserController.info = (req, res) => {
  res.json('INFO VALIDADA');
};

UserController.sendEmailTets = (req, res) => {
  const { email } = req.body;
  EmailService.sendValidationMail({ name: 'Perez', lastName: 'Perez', email }, 'asd');
  res.json('Email');
};
