const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const { validationResult } = require('express-validator');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
    let totalNumberOfProduct = 0;
    const currentPageNumber = +req.query.page || 1;

    Product.find().countDocuments()
        .then(numberOfPruduct => {
            totalNumberOfProduct = numberOfPruduct;
            return Product
                .find()
                .skip((currentPageNumber - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((products) => {
            const numberOfPages = Math.ceil(totalNumberOfProduct / ITEMS_PER_PAGE);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                currentPageNumber: currentPageNumber,
                hasPreviousPage: numberOfPages > 1 && currentPageNumber > 1,
                hasNextPage: numberOfPages > currentPageNumber
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
            });
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};
exports.getIndex = (req, res, next) => {
    const errorMsg = req.flash('error')[0];
    const currentPageNumber = +req.query.page || 1;
    let totalNumberOfProduct = 0;

    Product.find().countDocuments()
        .then(numberOfPruduct => {
            totalNumberOfProduct = numberOfPruduct;
            return Product
                .find()
                .skip((currentPageNumber - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((products) => {
            const numberOfPages = Math.ceil(totalNumberOfProduct / ITEMS_PER_PAGE);
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                errorMessage: errorMsg,
                currentPageNumber: currentPageNumber,
                hasPreviousPage: numberOfPages > 1 && currentPageNumber > 1,
                hasNextPage: numberOfPages > currentPageNumber
            });
        })
        .catch(err => {
            console.log('Error while fetching products : ', err);
            const error = new Error(err);
            return next(error);
        });
};
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    req.user.addToCart(productId)
        .then(dbresponse => {
            console.log(`Product with id : ${productId} was added to cart`);
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};
exports.getCart = async (req, res, next) => {
    try {
        const pupaltedUserObject = await req.user.populate('cart.items.productId'); // this populates in-place
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: pupaltedUserObject.cart.items,
            totalPrice: 0,
        });
    } catch (err) {
        return next(err);
    }
};
exports.getCheckout = async (req, res, next) => {
    try {
        const pupaltedUserObject = await req.user.populate('cart.items.productId'); // this populates in-place
        const totalPrice = pupaltedUserObject.cart.items.reduce((acc, currentValue) => {
            return acc + currentValue.quantity * currentValue.productId.price;
        }, 0)

        res.render('shop/checkout', {
            pageTitle: 'Checkout',
            path: '/checkout',
            products: pupaltedUserObject.cart.items,
            totalPrice: totalPrice,
        });
    } catch (err) {
        return next(err);
    }
};
exports.postCreateOrder = async (req, res, next) => {
    try {
        const pupalatedUserObject = await req.user.populate('cart.items.productId');
        // console.log(pupalatedUserObject.cart.items);
        const order = new Order({
            user: {
                email: req.user.email,
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

    } catch (er) {
        const error = new Error(err);
        return next(error);
    }
};
exports.postDeleteProductFromCart = (req, res, next) => {
    req.user.deleteFromCartById(req.body.productId)
        .then(_deletionResult => {
            console.log('Product succesfully has beed deleted from cart ...');
            res.redirect('/cart');
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};
exports.getOrders = (req, res, next) => {
    Order
        .find({ 'user.userId': req.user._id })
        // .select()
        // .populate('products.productId')
        .then((orders) => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders,
            });
        })
        .catch(err => {
            const error = new Error(err);
            return next(error);
        });
};
exports.getInvoice = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return next(new Error(errors.array()[0].msg));
    }
    const orderId = req.params.orderId;
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);
    const products = req.session.user.orderedProdList;
    let totalPrice = 0;

    const pdfdoc = new PDFDocument();
    pdfdoc.pipe(fs.createWriteStream(invoicePath));
    pdfdoc.pipe(res);

    pdfdoc.fontSize(24).text(`Invoice for user: ${req.user.email}`);
    pdfdoc.fontSize(20).text('---------------------------------------------------------------------');

    products.forEach((prod, index) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfdoc.fontSize(16).text(`${prod.product.title} - ${prod.quantity} * ${prod.product.price}`);
        pdfdoc.fontSize(16).text('');
        index < products.length - 1 && pdfdoc.fontSize(10).text('------------------------------------------------------------------------------------------------------------------------------------------');
    });

    pdfdoc.fontSize(16).text('');
    pdfdoc.fontSize(20).text('---------------------------------------------------------------------');
    pdfdoc.fontSize(20).text(`Total Price: ${totalPrice} $`);

    pdfdoc.end();

    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
    // file.pipe(res)

    // fs.readFile(invoicePath, (err, data) => {
    //     if (err) {
    //         // it goes to the special express middleware, see set up in App.js
    //         return next(err);
    //     }
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);
    //     res.send(data);
    // });

};