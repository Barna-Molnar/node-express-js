const express = require('express');
const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next) => {
    console.log('add-product middleware');
    //  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
     res.render('add-product', { 
        pageTitle: 'Add Prodcut Page',
        formCss: true,
        path: '/admin/add-product',
    });
});

router.post('/add-product', (req, res, next) => {
    products.push({ title: req.body.title, price: req.body.price, description: req.body.description})
    console.log('/product middleware', req.body);
    res.redirect('/');
});

exports.routes = router;
exports.products = products;;