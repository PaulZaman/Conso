// models/Banker.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const Bank = require('./BankModel');
const User = require('./UserModel');

const Banker = sequelize.define('Banker', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	bank_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

// Define associations
Banker.belongsTo(Bank, { foreignKey: 'bank_id' });
Banker.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Banker;
