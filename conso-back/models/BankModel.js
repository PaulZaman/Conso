// models/Bank.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Bank = sequelize.define('Bank', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	documents_required: {
		type: DataTypes.JSON,
		allowNull: true,
	},
	logo_path: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});


module.exports = Bank;
