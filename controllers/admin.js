const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.getAdminProducts = (req, res, next) => {
    Product
        .find({ userId: req.user._id })
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
            const error = new Error(err);
            return next(error);
        });
};
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product Page',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: '',
        errors: []
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
                hasError: false,
                errorMessage: '',
                errors: [],
                product: product,
            });
        });
};
exports.postEditProduct = async (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description || '';
    const image = req.file;
    const productId = req.body.productId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product Page',
            path: '/admin/add-product',
            editing: true,
            hasError: true,
            product: { title, price, description, imageUrl, _id: productId },
            errors: errors.array(),
            errorMessage: errors.array()[0].msg,
        });
    }

    try {
        const existingProduct = await Product.findById(productId);
        if (existingProduct.userId.toString() !== req.user._id.toString()) {
            // Normally we do not see this product , but for safetyness we double check
            req.flash('error', 'Action Denied! You tried to edit a Product which was not created by you!');
            return res.redirect('/');
        }
        existingProduct.title = title;
        existingProduct.price = price;
        existingProduct.description = description;
        if(image) {
            existingProduct.imageUrl = image.path;
        }

        await existingProduct.save();
        res.redirect('/');

    } catch (err) {
        const error = new Error(err);
        return next(error);
    }
};

exports.postDeleteProduct = (req, res, next) => {
    Product.deleteOne({ _id: req.body.productId, userId: req.user._id })
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file;
    const userId = req.user._id;

    if (!image) {
        res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product Page',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: { title, price, description },
            errors: [],
            errorMessage: 'Incorrect image',
            
        });
    }
    const errors = validationResult(req);
    console.log('validationResult: ', errors.array());

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product Page',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: { title, price, description },
            errors: errors.array(),
            errorMessage: errors.array()[0].msg,
        });
    }

    const imageUrl = image.path;
    const product = new Product({ title, price, description, imageUrl, userId });
    product.save()
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};