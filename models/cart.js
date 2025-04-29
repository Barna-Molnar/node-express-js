const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

const calculateTotal = (sum1, sum2) => {
    return Number(sum1) + Number(sum2);
}

module.exports = class Cart {
    constructor() {
        this.products = [];
        this.totalPrice = 0;
    }

    static addProduct(id, productPrice) {

        fs.readFile(p, (err, fileContent) => {
            // fetch previous cart
            let cart = { products: [], totalPrice: 0 };
            console.log(fileContent);
            if (!err) {
                cart = JSON.parse(fileContent);
            };
            // analyze cart => find existing product
            const existinfProductIndex = cart.products.findIndex(p => p.id === id);
            if (existinfProductIndex > -1) {
                // add quantity to existing product / increase totalprice
                const existingProduct = cart.products[existinfProductIndex];
                const updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
                cart.products = [...cart.products];
                cart.products[existinfProductIndex] = updatedProduct;
                cart.totalPrice = calculateTotal(cart.totalPrice, productPrice);
            } else {
                // add new product / increase totalprice
                const newProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, newProduct];
                cart.totalPrice = calculateTotal(cart.totalPrice, productPrice);
            }

            console.log({ cart });
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if(err) console.log(`Error whilst writing data into ${p} Err: ${err}`);
            });
        });

    }
};