const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/path');

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
    constructor({ title, price, description, imageUrl }) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    
    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log({ err });
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
};