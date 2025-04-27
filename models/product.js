const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/path');

const getProductsFromFile = (cb) => {
    const p = path.join(rootDir, 'data', 'products.json');
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        }
        cb(JSON.parse(fileContent));
    });
};

module.exports = class Product {
    constructor({ title, price, description }) {
        this.title = title;
        this.price = price;
        this.description = description;
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