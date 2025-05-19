const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            });
        })
        .catch(err => {
            console.log('Error while fetching products : ', err);
        });
};
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/product',
            });
        })
        .catch(err => {
            console.log('Error while fetching product : ', err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((rows) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch(err => {
            console.log('Error while fetching products : ', err);
        });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    req.user.addToCart(productId)
        .then(dbresponse => {
            console.log(`Product with id : ${productId} was added to cart`);
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cartItems => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartItems,
                totalPrice: 0,
            });
        });
};

exports.postCreateOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        });

};

exports.postDeleteProductFromCart = (req, res, next) => {
    console.log(req.body.productId)
    req.user.deleteFromCartById(req.body.productId)
        .then(_deletionResult => {
            console.log('Product succesfully has beed deleted from cart ...');
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {

    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        });


};
exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });

};