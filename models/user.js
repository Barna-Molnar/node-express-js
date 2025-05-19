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
                return result;
            })
            .catch(err => console.log(err));
    }

    addToCart(productId) {
        const toBeUpdatedCartItems = [...this.cart.items];

        const searchedItemIndex = this.cart.items.findIndex(item => item.productId === productId);
        if (searchedItemIndex >= 0) {
            toBeUpdatedCartItems[searchedItemIndex].quantity += 1;
        } else {
            toBeUpdatedCartItems.push({ productId: productId, quantity: 1 });
        }

        const updatedCart = { items: toBeUpdatedCartItems };
        const db = getDb();

        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDb();
        const prodIds = this.cart.items.map(item => new ObjectId(item.productId));
        return db.collection('products')
            .find({ _id: { $in: prodIds } })
            .toArray()
            .then(batchFindResult => {
                const enhancedCartItems = batchFindResult.map(prod => {
                    const currentProductInCart = this.cart.items.find(item => item.productId === prod._id.toString());

                    if (!currentProductInCart) return null;

                    return {
                        id: prod._id,
                        title: prod.title,
                        price: prod.price,
                        quantity: currentProductInCart.quantity
                    };
                });
                return enhancedCartItems;
            });
    }

    deleteFromCartById(productId) {
        const db = getDb();
        const updatedCart = { items: this.cart.items.filter(item => item.productId !== productId) };
        return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }

    addOrder() {
        const db = getDb();
        const emptyCart = { items: [] };

        return this
            .getCart()
            .then(cartProdcuts => {
                const order = {
                    items: cartProdcuts,
                    user: { _id: new ObjectId(this._id), name: this.username }
                };

                return db.collection('orders').insertOne(order);
            })
            .then(_result => {
                //clear locally
                this.cart = emptyCart;
                // clear in db
                return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: emptyCart } });
            });
    }

    getOrders() {
        const db = getDb();

        return db
        .collection('orders')
        .find({ 'user._id': new ObjectId(this._id) })
        .toArray()
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