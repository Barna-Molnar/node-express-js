const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isLoggedIn: false
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
            console.log('Error: user already exist :', exisingUser)
            return res.redirect('/signup');
         }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, cart: { items: [] } });

        await user.save();
        res.redirect('/login');

    } catch (error) {
        console.log('Error in postSignup', error)
    }
};

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    User.findById('682ad496608187c07bf3ca42')
        .then(user => {
            console.log('postLogin....');
            console.log({ user });
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        console.log('destroy session...');
        res.redirect('/login');
    });
};
