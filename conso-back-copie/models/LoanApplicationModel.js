// models/LoanApplication.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./UserModel');
const Bank = require('./BankModel');

const LoanApplication = sequelize.define('LoanApplication', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	bank_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	status: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	date_posted: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
	amount: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	tenure: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

LoanApplication.belongsTo(User, { foreignKey: 'user_id' });
LoanApplication.belongsTo(Bank, { foreignKey: 'bank_id' });

module.exports = LoanApplication;
