const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));
exports.getSignup = (req, res, next) => {
    const errorMsg = req.flash('error')[0];
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isLoggedIn: false,
        errorMessage: errorMsg,
    });
};

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmConfirm = req.body.confirmPassword;
    console.log({ email, password, confirmConfirm });

    try {
        const exisingUser = await User.findOne({ email: email });
        if (exisingUser) {
            req.flash('error', 'User already exist..., please choose another email!');
            await req.session.save();
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, cart: { items: [] } });

        await user.save();
        try {
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
    const errorMsg = req.flash('error')[0];
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: errorMsg,
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const exisingUser = await User.findOne({ email: email });
        if (!exisingUser) {
            req.flash('error', 'Invalid user');
            await req.session.save();
            return res.redirect('/login');
        }

        const isPasswordValid = await bcrypt.compare(password, exisingUser.password);
        if (!isPasswordValid) {
            req.flash('error', 'Invalid password');
            await req.session.save();
            return res.redirect('/login');
        }

        req.session.isLoggedIn = true;
        req.session.user = exisingUser;
        res.redirect('/');

    } catch (error) {
        console.log(err);
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