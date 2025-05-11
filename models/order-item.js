const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


/**
 * @typedef {Object} OrderItemAttributes
 * @property {number} id
 * @property {number} quantity
 */

/**
 * @type {import('sequelize').ModelStatic<import('sequelize').Model<OrderItemAttributes>>}
**/

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // totalPrice: {
    //     type: Sequelize.DOUBLE,
    //     allowNull: false
    // }
});

module.exports = OrderItem;