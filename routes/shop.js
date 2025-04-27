const express = require('express');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('shop middleware => adminData', adminData);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', { 
        products: adminData.products,
        pageTitle: 'Shop',
        productCss: true, 
        path: '/',
    });

});

module.exports = router;