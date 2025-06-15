const express = require('express');

const validations = require('../utils/validation');
const { signup, login } = validations;

const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', login.userValidation_login(), authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', signup.emailValidation_signup(), signup.passwordValidation_signup(), signup.confirmedPasswordValidation_singup(), authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getUpdatePassword);

router.post('/update-password', authController.postUpdatePassword);

module.exports = router;