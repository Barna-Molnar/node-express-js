const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    Product
        .find()
        // .select()
        .populate('userId')
        .then((products) => {
            // console.log(products)
            res.render('admin/products', {
                pageTitle: 'Admin Products Page',
                prods: products,
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
        editing: false,
    });
};
exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    const editMode = req.query.edit;

    Product.findById(productId)
        .then((product) => {
            if (!product) {
                res.redirect('/');
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
    Product
        .findById(req.body.productId)
        .then(product => {
            product.title = req.body.title;
            product.price = req.body.price;
            product.description = req.body.description;
            product.imageUrl = req.body.imageUrl;

            return product.save();
        })
        .then(_response => {
            res.redirect('/');
        });
};
exports.postDeleteProduct = (req, res, next) => {
    Product
        .findByIdAndDelete(req.body.productId)
        .then(() => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
};
exports.postAddProduct = (req, res, next) => {
    const newProduct = {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        userId: req.user._id
    };
    const product = new Product(newProduct);
    product
        .save()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
};