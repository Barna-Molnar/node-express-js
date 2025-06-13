const express = require('express');
const { check, body } = require('express-validator');

const User = require('../models/user')
const authController = require('../controllers/auth');
const router = express.Router();

const passwordValidation = () => [body('password').isLength({ min: 5 }).withMessage('Password is not long enough!')];
const emailValidation = () => [
    check('email')
        .custom(async (value, { req }) => {
            const exisingUser = await User.findOne({ email: value });
            if (exisingUser) {
                // req.flash('error', 'User already exist..., please choose another email!');
                // await req.session.save();
                // return res.redirect('/signup');
                throw new Error('User already exist..., please choose another email!');
            }
        })
];
const confirmedPasswordValidation = () => [
    body('password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })];

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