const express = require('express');
const Test = require('./app/controllers/test');
const UserController = require('./app/controllers/UserController');
const { jwtVerify } = require('./common/middleware/JWTAuthentication');

const router = express.Router();

router.get('/', Test.test);

// User
router.post('/create-user', UserController.createUser);
router.post('/login', UserController.login);
router.get('/info', jwtVerify, UserController.info);

module.exports = router;
