exports.getLogin = (req, res, next) => {
  
    console.log('req.session.isLoggedIn', req.session.isLoggedIn)
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: req.isLoggedIn
    });
};
exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true
    res.redirect('/');
};