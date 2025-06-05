const User = require('../models/user');

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/login',
        isLoggedIn: false
    });
};

exports.postSignup = (req, res, next) => {
    // User.findById('682ad496608187c07bf3ca42')
    //     .then(user => {
    //         console.log('postLogin....');
    //         console.log({ user });
    //         req.session.isLoggedIn = true;
    //         req.session.user = user;
    //         res.redirect('/');
    //     })
    //     .catch(err => console.log(err));
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
