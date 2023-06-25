const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./UserModel');

const Message = sequelize.define('Message', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	sender_id: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'id',
		},
	},
	recipient_id: {
		type: DataTypes.INTEGER,
		references: {
			model: User,
			key: 'id',
		},
	},
	message_content: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	date_sent: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
});

module.exports = Message;
