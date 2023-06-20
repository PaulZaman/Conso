// controllers/documentController.js

const Document = require('../models/DocumentModel');
const User = require('../models/UserModel');
const DocumentType = require('../models/DocumentTypeModel');


// Get all documentTypes
async function getDocumentTypes(req, res) {
	try {

		const documentTypes = await DocumentType.findAll();
		res.status(200).json(documentTypes);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving document types' });
	}
}

// Post a document for a user
async function postDocumentUser(req, res) {
	try {
		const { document_type_id, document_path, id } = req.body;
		const user = await User.findByPk(id);

		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if document type exists
		const documentType = await DocumentType.findByPk(document_type_id);
		if (!documentType) {
			return res.status(404).json({ message: 'Document type not found' });
		}

		// Check if document already exists for the user
		const existingDocument = await Document.findOne({ where: { user_id: id, document_type_id } });

		if (existingDocument) {
			// Update the existing document
			existingDocument.document_path = document_path;
			await existingDocument.save();

			return res.status(200).json({ message: 'Existing document replaced successfully', document: existingDocument });
		}

		// Create a new document
		const document = await Document.create({ document_type_id, document_path, user_id: id });

		res.status(201).json({ message: 'Document created successfully', document });
	} catch (error) {
		console.log(error);
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		res.status(500).json({ message: 'Error creating document' });
	}
}

// Get all documents for a user
async function getDocumentsUser(req, res) {
	try {
		// TODO check if the bank asking has an application with the user, or if the request comes from the user
		const { id } = req.body;
		const user = await User.findByPk(id);

		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Get all documents for the user
		const documents = await Document.findAll({ where: { user_id: id } });

		res.status(200).json(documents);

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving documents' });
	}
}



module.exports = { getDocumentTypes, postDocumentUser, getDocumentsUser }