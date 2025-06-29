const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: { type: Object, reqired: true },
            quantity: { type: Number, reqired: true }
        }
    ],


    user: {   
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        email: {
            type: String,
            required: true,
        }
    }

});

module.exports = mongoose.model('Order', orderSchema);;