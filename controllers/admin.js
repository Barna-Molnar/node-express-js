const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            pageTitle: 'Admin Products Page',
            prods: products,
            path: '/admin/products',
        });
    });
};
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product Page',
        path: '/admin/add-product',
        editing: false
    });
};
exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;

    Product.findById(productId, (product) => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
        });
    });
};
exports.postEditProduct = (req, res, next) => {

    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        id: req.body.productId
    });
    console.log(product)
    product.save();
    res.redirect('/');
};
exports.postDeleteProduct = (req, res, next) => {
   
    Product.delete(req.body.productId, (err) => {
        console.log({ err });
    });
    res.redirect('/');
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