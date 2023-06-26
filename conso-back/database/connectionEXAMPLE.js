// database/connection.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Conso_DB', 'USER', 'PASSWORD', {
	host: 'localhost',
	dialect: 'mysql',
});

module.exports = sequelize; 