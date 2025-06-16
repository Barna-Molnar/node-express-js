const { check, body } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const passwordValidation_signup = () => [
    body('password')
        .isLength({ min: 5 })
        .trim()
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
        .normalizeEmail()
];

const confirmedPasswordValidation_singup = () => [
    body('password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
    })
    .trim()
];

const userValidation_login = () => [
    body('email').notEmpty().withMessage('Email is required.'),
    body('email').isEmail().normalizeEmail().withMessage('Email has to be valid!'),
    
    body('password').notEmpty().trim().withMessage('Password is required.'),

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

/* 
// Custom validation for 'email' to find the user
body('email').custom(async (email, { req }) => {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      // It's highly recommended for security reasons to return a generic
      // "Invalid credentials" message for both email not found and wrong password.
      // This prevents user enumeration.
      throw new Error('Invalid email or password.');
    }

    // Attach the found user to the request object for the subsequent
    // password validation and the controller.
    req.body.user = existingUser;

    return true; // Indicate success
  }),

  // Custom validation for 'password' to compare it with the found user's password
  // This validator depends on the previous 'email' custom validator having found
  // and attached the user to `req.body.user`.
  body('password').custom(async (password, { req }) => {
    const existingUser = req.body.user; // Get the user attached by the email validator

    // This check is a safeguard; ideally, if existingUser is null,
    // the previous 'email' validator would have already thrown an error.
    if (!existingUser) {
      throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    return true;
  }),
  */