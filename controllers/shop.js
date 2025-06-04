const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then((products) => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                isLoggedIn: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log('Error while fetching products : ', err);
        });
};
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product
        .findById(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/product',
                isLoggedIn: true
            });
        })
        .catch(err => {
            console.log('Error while fetching product : ', err);
        });
};
exports.getIndex = (req, res, next) => {
    Product
        .find()
        .then((rows) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
                isLoggedIn: req.session.isLoggedIn
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
exports.getCart = async (req, res, next) => {
    try {
        const pupaltedUserObject = await req.user.populate('cart.items.productId'); // this populates in-place

        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: pupaltedUserObject.cart.items,
            totalPrice: 0,
            isLoggedIn: req.session.isLoggedIn
        });
    } catch (err) {
        next(err);
    }
};

exports.postCreateOrder = async (req, res, next) => {
    try {
        const pupalatedUserObject = await req.user.populate('cart.items.productId');
        // console.log(pupalatedUserObject.cart.items);
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: pupalatedUserObject.cart.items.map(item => {
                const productDetails = item.productId;
                const embededProduct = {
                    _id: productDetails._id,
                    title: productDetails.title,
                    price: productDetails.price,
                    description: productDetails.description,
                    imageUrl: productDetails.imageUrl,
                    userId: productDetails.userId

                };
                return {
                    quantity: item.quantity,
                    product: embededProduct
                };
            })
        });

        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');

    } catch (error) {
        console.log('ERROR', error);
    }
};

exports.postDeleteProductFromCart = (req, res, next) => {
    req.user.deleteFromCartById(req.body.productId)
        .then(_deletionResult => {
            console.log('Product succesfully has beed deleted from cart ...');
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};
exports.getOrders = (req, res, next) => {
    Order
        .find({'user.userId': req.user._id})
        // .select()
        // .populate('products.productId')
        .then((orders) => {
            console.log(orders[0])
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
                isLoggedIn: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log('Error while fetching products : ', err);
        });
};
exports.getCheckout = (req, res, next) => {

    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        isLoggedIn: req.session.isLoggedIn
    });

};