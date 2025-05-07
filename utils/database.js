const Sequelize = require('sequelize')


const sequelize = new Sequelize('node-server', 'root', 'Bazdmeg1990', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports= sequelize;
