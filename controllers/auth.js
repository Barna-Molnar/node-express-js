exports.getLogin = (req, res, next) => {
    const cookieString = req.get('Cookie') || '';
    const match = cookieString.match(/isLoggedIn=([^;]+)/);
    const isLoggedIn = match && match[1]
  
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isLoggedIn: isLoggedIn
    });
};
exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'isLoggedIn=true');
    res.redirect('/');
};