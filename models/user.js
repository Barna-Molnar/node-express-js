const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        reqired: true,
    },
    email: {
        type: String,
        reqired: true,
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', reqired: true },
                quantity: { type: Number, reqired: true }
            }
        ]
    },
});

userSchema.methods.addToCart = function (productId) {
    const toBeUpdatedCartItems = [...this.cart.items];

    const searchedItemIndex = this.cart.items.findIndex(item => item.productId.toString() === productId.toString());

    if (searchedItemIndex >= 0) {
        toBeUpdatedCartItems[searchedItemIndex].quantity += 1;
    } else {
        toBeUpdatedCartItems.push({ productId: productId, quantity: 1 });
    }

    const updatedCart = { items: toBeUpdatedCartItems };

    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.deleteFromCartById = function (productId) {
    const filteredItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
    this.cart.items = filteredItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart.items = [];
    return this.save();
};

module.exports = mongoose.model('User', userSchema);