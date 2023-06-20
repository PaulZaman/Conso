// models/DocumentTypeModel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const DocumentType = sequelize.define('DocumentType', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	nametype: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
});

module.exports = DocumentType;