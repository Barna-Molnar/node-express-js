const express = require('express');
const { emailValidation, passwordValidation, confirmedPasswordValidation } = require('../utils/validation');

const User = require('../models/user');
const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', emailValidation(), passwordValidation(), confirmedPasswordValidation(), authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getUpdatePassword);

router.post('/update-password', authController.postUpdatePassword);

module.exports = router;