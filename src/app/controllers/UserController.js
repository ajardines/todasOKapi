const UserService = require('../services/UserService');

const UserController = module.exports;

UserController.createUser = async (req, res, next) => {
  const user = req.body;

  return UserService.createUser(user)
    .then((userCreated) => res.send(userCreated))
    .catch(next);
};

UserController.login = (req, res, next) => {
  // if (req.body.username === 'admin' && req.body.password === '123') {
  //   const payload = {
  //     check: false,
  //   };
  //   const token = jwt.sign(payload, keys.secretKey);

  //   res.json({
  //     message: '!Autenticacion exitosa!',
  //     token,
  //   });
  // } else {
  //   res.json({
  //     message: 'Usuario y/o password incorrectos',
  //   });
  // }
  const user = req.body;

  return UserService.login(user)
    .then((token) => res.send(token))
    .catch(next);
};

UserController.info = (req, res) => {
  res.json('INFO VALIDADA');
};
