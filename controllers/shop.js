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
    let newQuantity = 1;
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
                newQuantity = product.cartItem.quantity + 1;
                return product;
            } else {
                return Product.findByPk(productId);
            }
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log('Error while working on Cart ', err);
        });
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

exports.postCreateOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
           return req.user
                .createOrder()
                .then((order) => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { quantity: product.cartItem.quantity }
                            return product
                        })
                    );
                })
                .catch(err => console.log('ERROR:', err))
        })
        .then(result => {
            fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders')
        })

};

exports.postDeleteProductFromCart = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then((products) => {
            const toBeDeletedProduct = products[0];
            return toBeDeletedProduct.cartItem.destroy();
        })
        .then(deletionResult => {
            console.log('Product succesfully has beed deleted...', deletionResult);
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {

    req.user
    .getOrders({include: ['products']})
    .then(orders => {
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    })


};
exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });

};