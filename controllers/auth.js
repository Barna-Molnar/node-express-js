const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const createEmailTransporter = require('../utils/email');

exports.getSignup = (req, res, next) => {
    const errorMsg = req.flash('error')[0];
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isLoggedIn: false,
        errorMessage: errorMsg,
        oldInput: { email: '', password: '', confirmPassword: '' },
        errors: [],
    });
};

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return (
            res.status(422)
                .render('auth/signup', {
                    pageTitle: 'Signup',
                    path: '/signup',
                    isLoggedIn: false,
                    errorMessage: errors.array()[0].msg,
                    oldInput: { email, password, confirmPassword },
                    errors: errors.array()
                })
        );
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, cart: { items: [] } });

        await user.save();
        try {
            const transporter = await createEmailTransporter();
            const emailSendStatus = await transporter.sendMail({
                to: email,
                from: 'hanta911@gmail.com',
                subject: 'Signup succeeded!',
                html: '<h1>You successfully signed up!</h1>'
            });
            console.log({ emailSendStatus });
        } catch (error) {
            console.log('Error by sending mail: ', error);
        }

        res.redirect('/login');

    } catch (error) {
        console.log('Error in postSignup', error);
    }
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: '',
        oldInput: { email: '', password: '' },
        errors: [],
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: errors.array()[0].msg,
                    oldInput: { email, password },
                    errors: errors.array()
                });

        }

        // req.session.isLoggedIn = true;
        // req.session.user = exisingUser;
        res.redirect('/');

    } catch (error) {
        console.log(error);
    }
};

exports.postLogout = (req, res, next) => {
    console.log('destroy session...');

    req.session.destroy((err) => {
        console.log(err);
        console.log('session has been destroyed');
        res.redirect('/login');
    });
};

exports.getResetPassword = (req, res, next) => {
    const errorMsg = req.flash('error')[0];
    res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        path: '/reset-password',
        errorMessage: errorMsg,
    });
};
exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;
    // const errorMsg = req.flash('error')[0];
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log('randomBytes Err', err);
            res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        console.log('randomBytes token', token);
        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No user with that email found');
                    return res.redirect('/reset-password');
                }
                console.log('User.findOne', user);
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: email,
                    from: 'hanta911@gmail.com',
                    subject: 'Reset Password!',
                    html: `
                <h1>You requested resetting password!</h1>
                <p>Click this link to set a new password: <a href="http://localhost:8080/reset-password/${token}">Reset Password</a></p>
                <p>If you didn't request this, please ignore this email.</p>
                `
                });

            })
            .catch(err => console.log(err));
    });
};

exports.getUpdatePassword = (req, res, next) => {
    const errorMsg = req.flash('error')[0];
    const token = req.params.token;

    User
        .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid or expired token');
                return res.redirect('/reset-password');
            }
            res.render('auth/update-password', {
                pageTitle: 'Update Password',
                path: '/reset-password',
                errorMessage: errorMsg,
                userId: user._id.toString(),
                passwordToken: token,
            });
        })
        .catch(err => console.log(err));
};

exports.postUpdatePassword = (req, res, next) => {
    const errorMsg = req.flash('error')[0];
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const token = req.body.passwordToken;
    let tobeUpdateUser;

    console.log('postUpdatePassword: ', { userId, newPassword });
    User
        .findOne({ _id: userId, resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Expired token, please request a new password reset');
                return res.redirect('/reset-password');
            }
            tobeUpdateUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            tobeUpdateUser.password = hashedPassword;
            tobeUpdateUser.resetToken = undefined;
            tobeUpdateUser.resetTokenExpiration = undefined;
            return tobeUpdateUser.save();
        })
        .then(success => {
            console.log('Updating password was succesful');
            res.redirect('/login');
        })
        .catch(err => console.log(err));
};