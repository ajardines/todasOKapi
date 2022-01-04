const express = require('express');
const Test = require('./app/controllers/test');
const UserController = require('./app/controllers/UserController');
const { jwtVerify } = require('./common/middleware/JWTAuthentication');

const router = express.Router();

// User
router.post('/create-user', UserController.createUser);
router.post('/login', UserController.login);
router.post('/forgot-password', UserController.forgotPassword);
router.put('/validate-email', jwtVerify, UserController.validateEmail);
router.put('/update-password', jwtVerify, UserController.updatePassword);
router.get('/get-user', jwtVerify, UserController.getUser);

// Test

router.get('/', Test.test);
router.get('/info', jwtVerify, UserController.info);
router.post('/send-email-test', UserController.sendEmailTets);

module.exports = router;
