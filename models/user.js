const { ObjectId } = require('mongodb');

const getDb = require('../utils/database').getDb;
class User {
    constructor({ username, email, cart, id }) {
        this.username = username;
        this.email = email;
        this.cart = cart || { items: [] }; // { items: [{...}, {...}]}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users')
            .insertOne(this)
            .then(result => {
                console.log('INSERT RESULT FROM SAVING A USER', result);
            })
            .catch(err => console.log(err));
    }

    addToCart(productId) {
        const updatedCartItems = [...this.cart.items];
        
        const searchedItemIndex = this.cart.items.findIndex(item => item.productId === productId);
        if (searchedItemIndex >= 0) {
            updatedCartItems[searchedItemIndex].quantity += 1;
        } else {
            updatedCartItems.push({ productId: productId, quantity: 1 });
        }

        const updatedCart = { items: updatedCartItems };
        const db = getDb();
        
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users')
            .find({ _id: new ObjectId(userId) })
            .next()
            .then((user) => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;