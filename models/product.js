const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/path');
const Cart = require('./cart');


const p = path.join(rootDir, 'data', 'products.json');
const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor({ title, price, description, imageUrl, id }) {
        this.id = id ? id : null;
        this.title = title;
        this.price = price;
        this.description = description.trim();
        this.imageUrl = imageUrl;
    }

    save() {
        getProductsFromFile(products => {
            let updatedProducts = [];
            if (this.id) {
                const filteredProducts = products.filter(p => p.id !== this.id);
                updatedProducts = [...filteredProducts, this];

            } else {
                updatedProducts = [...products];
                this.id = Math.random().toString();
                updatedProducts.push(this);
            }

            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                console.log({ err });
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(productId, cb) {
        getProductsFromFile(allProducts => {
            const product = allProducts.find(p => p.id === productId);
            cb(product);
        });
    }

    static delete(productId) {
        getProductsFromFile(allProducts => {
            const toBeDeletedProduct = allProducts.find(p => p.id === productId)
            const updatedProducts = allProducts.filter(p => p.id !== toBeDeletedProduct.id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if(!err) {
                    Cart.deleteProductById(toBeDeletedProduct.id, toBeDeletedProduct.price)
                    return;
                }
                console.log({ err });
            });
        });
    }

};