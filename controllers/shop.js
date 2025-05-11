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
            console.log('Error while fetching products : ', err);
        });
};
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
        .then((product) => {
            console.log('singleProduct', product);
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
    Product.findAll()
        .then((rows) => {
            console.log('rows', rows);
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
    const newQuantity = 1;
    let fetchedCart;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0] || undefined;
            if (product) {
                // later
            } else { 
                return Product.findByPk(productId)
                    .then(product => {
                        return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
                    })
                    .catch(err => {
                        console.log('Error while adding product to cart : ', err);
                    });
            }
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log('Error while fetching cart : ', err);
        });

    // Product.findByPk(productId)
    //     .then((product) => {
    //         Cart.addProduct(productId, product.price);
    //         res.redirect('/cart');
    //     });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: products,
                totalPrice: 0,
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
            console.log('Error while deleting from cart : ', err);
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