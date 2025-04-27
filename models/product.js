const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/path');

module.exports = class Product {
    constructor({ title, price, description }) {
        this.title = title;
        this.price = price;
        this.description = description;
    }
    save() {
        const p = path.join(rootDir, 'data', 'products.json');

        fs.readFile(p, (err, fileContent) => {
            // if file not found, create an empty array
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log({ err });
            });

        });
    }

    static fetchAll(cb) {
        const p = path.join(rootDir, 'data', 'products.json');
        return fs.readFile(p, (err, fileContent) => {
            // console.log({ err });
            // console.log(JSON.parse(fileContent));
            return !err ? cb(JSON.parse(fileContent)) : cb([]);
        });
    }
};