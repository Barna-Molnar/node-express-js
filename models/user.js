const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

/**
 * @typedef {Object} UserAttributes
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @type {import('sequelize').ModelStatic<import('sequelize').Model<UserAttributes>>}
 */
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

module.exports = User;