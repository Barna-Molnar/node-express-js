module.exports  = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        console.log('user is not authenticated and wan to access protected route', req.originalUrl);
        return res.redirect('/login');
    }
    next();
}