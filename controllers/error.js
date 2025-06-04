exports.pageNotFound = (req, res, next) => {
    // console.log('Page not found middleware');
    // chaining fns => send has to be the last one
    // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
    res.status(404).render('404', {
        pageTitle: 'Page not found Template',
        path: '',
        isLoggedIn: req.session.isLoggedIn,
    });
};