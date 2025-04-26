const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('shop middleware => adminData', adminData);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', { 
        products: adminData.products,
        pageTitle: 'Shop',
        productCss: true, 
        activeShop: true,
    });

});

module.exports = router;