const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then((rows) => {
        res.render('shop/product-list', {
            prods: rows,
            pageTitle: 'All Products',
            path: '/products',
        });
    })
    .catch(err => {
        console.log('Error while fetching products : ', err)
    });
};
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
    .then((product) => {
        console.log('singleProduct', product)
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/product',
        });
    })
    .catch(err => {
        console.log('Error while fetching product : ', err)
    });
};
exports.getIndex = (req, res, next) => {
    Product.findAll()
    .then((rows) => {
        console.log('rows', rows)
        res.render('shop/index', {
            prods: rows,
            pageTitle: 'Shop',
            path: '/',
        });
    })
    .catch(err => {
        console.log('Error while fetching products : ', err)
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
    .then((product) => {
        Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    })
};

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const carProducts = [];
            products.forEach(product => {
                const foundProductInCart = cart.products.find(p => p.id === product.id);
                if (foundProductInCart) {
                    carProducts.push({ productData: product, qty: foundProductInCart.qty });
                }
            });


            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: carProducts,
                totalPrice: cart.totalPrice,
            });
        });
    });

};

exports.postDeleteProductFromCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
    .then(product => {
        Cart.deleteProductById(productId, product.price);
        res.redirect('/cart');
    })
    .catch(err => {
        console.log('Error while deleting from cart : ', err)
    });
};
exports.getOrders = (req, res, next) => {

    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
    });

};
exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });

};