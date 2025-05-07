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
        return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [this.title, this.price, this.description, this.imageUrl])
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products')
    }

    static findById(productId) {
        return db.execute('SELECT * FROM products WHERE products.id = ? LIMIT 1;',[productId])
    }

    static delete(productId) {
        return db.execute('DELETE FROM products WHERE products.id = ?;', [productId])
       
    }

};