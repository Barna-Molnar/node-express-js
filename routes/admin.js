const express = require('express');

const adminController = require('../controllers/admin');
const isAuthenticated = require('../middleware/is-authenticated');
const { product } = require('../utils/validation');

const router = express.Router();

router.get('/add-product', isAuthenticated, adminController.getAddProduct);

router.post('/add-product', product.productValidation(), isAuthenticated, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuthenticated, adminController.getEditProduct);

router.post('/edit-product', product.productValidation(), isAuthenticated, adminController.postEditProduct);

router.post('/delete-product', isAuthenticated, adminController.postDeleteProduct);

router.get('/products', adminController.getAdminProducts);

module.exports = router;