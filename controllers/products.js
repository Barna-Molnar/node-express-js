const products = [];

exports.getAddProduct =(req, res, next) => {
    console.log('add-product middleware');
    //  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
     res.render('add-product', { 
        pageTitle: 'Add Prodcut Page',
        formCss: true,
        path: '/admin/add-product',
    });
}

exports.postAddProduct = (req, res, next) => {
    products.push({ title: req.body.title, price: req.body.price, description: req.body.description})
    console.log('/product middleware', req.body);
    res.redirect('/');
}

exports.getProducts  = (req, res, next) => {
    console.log('shop middleware => adminData', products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop', { 
        products: products,
        pageTitle: 'Shop',
        productCss: true, 
        path: '/',
    });

}