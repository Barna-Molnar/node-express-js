const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    req.user.getProducts()
        .then((rows) => {
            res.render('admin/products', {
                pageTitle: 'Admin Products Page',
                prods: rows,
                path: '/admin/products',
            });
        })
        .catch(err => {
            console.log('Error while fetching products : ', err);
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

    req.user.getProducts({ where: { id: productId } })
    // Product.findByPk(productId)
        .then((products) => {
            const product = products[0];
            if(!product){
                res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
            });
        });
};
exports.postEditProduct = (req, res, next) => {
    const product = {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
    };

    Product
        .update(product, { where: { id: req.body.productId } })
        .then(_response => {
            res.redirect('/');
        });
};
exports.postDeleteProduct = (req, res, next) => {
    Product.destroy({ where: { id: req.body.productId } });
    res.redirect('/');
};

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
    }).then((insertResponse) => {
        // console.log('insert response : ', insertResponse);
        res.redirect('/');
    });
};