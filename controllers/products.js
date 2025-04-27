const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Prodcut Page',
        formCss: true,
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product({ title: req.body.title, price: req.body.price, description: req.body.description });
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        console.log({ products });
        res.render('shop', {
            products: products,
            pageTitle: 'Shop',
            productCss: true,
            path: '/',
        });
    });
};