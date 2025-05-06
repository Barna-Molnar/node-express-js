const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

const addToTotal = (total, sum2) => {
    const totalPrice = Number(total) + Number(sum2)
    return Number(totalPrice.toFixed(2))
}
const subtractFromTotal = (total, sum2) => {
    const totalPrice = Number(total) - Number(sum2)
    return Number(totalPrice.toFixed(2))
}

module.exports = class Cart {
    constructor() {
        this.products = [];
        this.totalPrice = 0;
    }

    static deleteProductById(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                console.log('Error while retrieving file : ', err)
                return;
            }
            const cart = JSON.parse(fileContent);
            const toBeDeletedProduct = cart.products.find(p => p.id === id);
            if(toBeDeletedProduct) {
                const updatedProducts = cart.products.filter(p => p.id !== toBeDeletedProduct.id);
                const updatedTotalPrice = subtractFromTotal(cart.totalPrice, price * toBeDeletedProduct.qty);
                const updatedCart = { products: updatedProducts, totalPrice: updatedTotalPrice };
                // console.log('updatedCart : ', JSON.stringify(updatedCart));
                fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                    console.log('Error while writing file : ', err);
                })
            }
        })
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
                cart.totalPrice = addToTotal(cart.totalPrice, productPrice);
            } else {
                // add new product / increase totalprice
                const newProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, newProduct];
                cart.totalPrice = addToTotal(cart.totalPrice, productPrice);
            }

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                if(err) console.log(`Error whilst writing data into ${p} Err: ${err}`);
            });
        });

    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                console.log('Error while retrieving file from Cart : ', err)
                cb(null)
            }
            const cart = JSON.parse(fileContent);
            cb(cart);
        })
    }
};