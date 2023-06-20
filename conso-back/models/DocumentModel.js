// models/Document.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./UserModel');
const DocumentType = require('./DocumentTypeModel');

const Document = sequelize.define('Document', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	document_type_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	document_path: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	date_posted: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	},
});

// Define associations
Document.belongsTo(User, { foreignKey: 'user_id' });
Document.belongsTo(DocumentType, { foreignKey: 'document_type_id' });

module.exports = Document;
