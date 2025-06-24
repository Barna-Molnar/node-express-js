const express = require('express');
const shopController = require('../controllers/shop');
const isAuthenticated = require('../middleware/is-authenticated');
const { order } = require('../utils/validation');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuthenticated, shopController.getCart);
router.post('/cart', isAuthenticated, shopController.postCart);

router.post('/cart-delete-item', isAuthenticated, shopController.postDeleteProductFromCart);

router.post('/create-order', isAuthenticated, shopController.postCreateOrder);

// router.get('/checkout', shopController.getCheckout);
router.get('/orders', isAuthenticated, shopController.getOrders);

router.get('/orders/:orderId', isAuthenticated, order.orderValidation(),  shopController.getInvoice);

module.exports = router;