const Sequelize = require('sequelize');
const sequelize = require('../utils/database');



/**
 * @typedef {Object} OrderAttributes
 * @property {number} id
 */

/**
 * @type {import('sequelize').ModelStatic<import('sequelize').Model<OrderAttributes>>}
**/

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
});

module.exports = Order;