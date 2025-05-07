const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, _filedData]) => {
        res.render('admin/products', {
            pageTitle: 'Admin Products Page',
            prods: rows,
            path: '/admin/products',
        });
    })
    .catch(err => {
        console.log('Error while fetching products : ', err)
    });;
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
    product.save()
    .then((res) => {
        console.log('insert response : ', res);
        res.redirect('/');
    })
};
exports.postDeleteProduct = (req, res, next) => {
   
    Product.delete(req.body.productId)
    .then((deleteResponse) => {
        console.log('delete response : ', deleteResponse);
        res.redirect('/');
    })
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