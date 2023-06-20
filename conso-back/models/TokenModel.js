// models/TokenModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./UserModel');

const Token = sequelize.define('Token', {
	token: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
	},
	expiry: {
		type: DataTypes.DATE,
		allowNull: false,
	}

});

// Define associations
Token.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Token;