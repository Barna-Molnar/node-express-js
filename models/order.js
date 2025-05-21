const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', reqired: true },
            quantity: { type: Number, reqired: true }
        }
    ],


    user: {   
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        }
    }

});

module.exports = mongoose.model('Order', orderSchema);;