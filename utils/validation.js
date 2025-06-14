const User = require('../models/user')
const { check, body } = require('express-validator');

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

module.exports = {passwordValidation, emailValidation, confirmedPasswordValidation}