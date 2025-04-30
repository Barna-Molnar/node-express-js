const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
    res.render('admin/products', {
        pageTitle: 'Admin Products Page',
        prods: products,
        path: '/admin/products',
    });
})
};
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product Page',
        path: '/admin/add-product',
    });
};
exports.getEditProduct = (req, res, next) => {
    console.log(req.query)
    const editMode = req.query.edit === 'true';
    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    });
    product.save();
    res.redirect('/');
};