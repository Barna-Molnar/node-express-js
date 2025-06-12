const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');
const router = express.Router();

const emailValidation = () => [check('email').isEmail().withMessage('Please enter a valid email')];

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', emailValidation(), authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.postResetPassword);

router.get('/reset-password/:token', authController.getUpdatePassword);

router.post('/update-password', authController.postUpdatePassword);

module.exports = router;