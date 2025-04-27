const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    res.render('admin/products', {
        pageTitle: 'Admin Products Page',
        path: '/admin/products',
    });
};
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product Page',
        path: '/admin/add-product',
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product({ title: req.body.title, price: req.body.price, description: req.body.description });
    product.save();
    res.redirect('/');
};