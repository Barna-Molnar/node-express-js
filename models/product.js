const db = require('../utils/database');
const Cart = require('./cart');

module.exports = class Product {
    constructor({ title, price, description, imageUrl, id }) {
        this.id = id ? id : null;
        this.title = title;
        this.price = price;
        this.description = description.trim();
        this.imageUrl = imageUrl;
    }

    save() {
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products')
    }

    static findById(productId) {
    }

    static delete(productId) {
    }

};