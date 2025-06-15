const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const passwordValidation_signup = () => [
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password is not long enough!')
];

const emailValidation_signup = () => [
    check('email')
        .custom(async (value, { req }) => {
            const exisingUser = await User.findOne({ email: value });
            if (exisingUser) {
                throw new Error('User already exist..., please choose another email!');
            }
        })
];

const confirmedPasswordValidation_singup = () => [
    body('password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })];

const userValidation_login = () => [
    body('email').notEmpty().withMessage('Email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    
    body()
        .custom(async ({ email, password }, _) => {
            const exisingUser = await User.findOne({ email: email });
            if (!exisingUser) {
                throw new Error('User not found! Please check your email!');
            } else {
                const isPasswordValid = await bcrypt.compare(password, exisingUser.password);
                if (!isPasswordValid) {
                    throw new Error('Invalid password...');
                }
            }
            return true;
        })
];

const validation = {
    signup: { passwordValidation_signup, emailValidation_signup, confirmedPasswordValidation_singup },
    login: { userValidation_login, }
};

module.exports = validation;