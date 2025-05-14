const { ObjectId } = require('mongodb');
const getDb = require('../utils/database').getDb;

class Product {
    constructor({ title, price, description, imageUrl, userId }) {
        this.price = price;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({ _id: new ObjectId(id) })
            .then((deleteResult) => {
                console.log(deleteResult);
            })
            .catch(err => {
                console.log(err);
            });
    }
    static findById(id) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new ObjectId(id) })
            .next()
            .then((product) => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then((products) => {
                return products;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static updateById(productId, newValues) {
        const db = getDb();
        return db.collection('products')
            .updateOne({ _id: new ObjectId(productId) }, { $set: newValues })
            .then(updateResult => {
                console.log('UpdateResult', updateResult);
            })
            .catch(err => console.log(err));

    }

    save() {
        const db = getDb();
        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log('INSERT RESULT FROM SAVE', result);
            })
            .catch(err => console.log(err));
    }

}

module.exports = Product;