// database/connection.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Conso_DB', 'root', 'ordi12345', {
	host: 'localhost',
	dialect: 'mysql',
});

module.exports = sequelize; 