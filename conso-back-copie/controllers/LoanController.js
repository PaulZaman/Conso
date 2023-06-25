// controllers/LoanController.js

const LoanApplication = require('../models/LoanApplicationModel');
const User = require('../models/UserModel');
const Bank = require('../models/BankModel');
const Document = require('../models/DocumentModel');
const DocumentType = require('../models/DocumentTypeModel');

// Create a new loan application
async function CreateLoanApplication(req, res) {
	const { amount, tenure, id, bank_id } = req.body;
	try {
		// Check if the user exists
		const user = await User.findOne({ where: { id } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if the bank exists
		const bank = await Bank.findOne({ where: { id: bank_id } });
		if (!bank) {
			return res.status(404).json({ message: 'Bank not found' });
		}

		// Check if the user has an existing loan application for this bank
		const existingLoanApplication = await LoanApplication.findOne({
			where: { user_id: id, bank_id },
		});
		if (existingLoanApplication) {
			// delete the existing loan application
			await existingLoanApplication.destroy();
		}

		// Check if the bank requires any documents
		const documents_required = bank.documents_required;
		if (!documents_required || typeof documents_required !== 'object') {
			return res.status(400).json({ message: 'Invalid documents_required field in the bank' });
		}

		// Get the required document types from the bank's document_required field
		const requiredDocumentTypes = Object.keys(documents_required);

		// get the ids of the document types required by the bank
		const document_required_types_ids = await DocumentType.findAll({
			where: { nametype: requiredDocumentTypes },
		});

		// find the user's documents
		const user_document_types_ids = await Document.findAll({ where: { user_id: id } }).document_type_id;

		// check if the user has all the required documents
		const missing_documents = document_required_types_ids.filter(
			(document_type_id) => !user_document_types_ids.includes(document_type_id)
		);

		if (missing_documents.length > 0) {
			return res.status(400).json({ message: 'Missing documents' });
		}

		// create the loan application
		const loanApplication = await LoanApplication.create({
			amount,
			tenure,
			user_id: id,
			bank_id,
			status: 'pending',
		});

		res.status(201).json({ loanApplication });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error creating loan application' });
	}
}


module.exports = { CreateLoanApplication };