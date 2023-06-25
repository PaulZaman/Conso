// controllers/bankController.js

const Bank = require('../models/BankModel');
const DocumentType = require('../models/DocumentTypeModel');

async function createBank(req, res) {
	try {
		const { name, documents_required = [], logo_path = '' } = req.body;

		// Create the bank using the Bank model
		const bank = await Bank.create({ name, documents_required, logo_path });

		res.status(201).json({ message: 'Bank created successfully', bank });
	} catch (error) {
		console.log(error);
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(500).json({ message: 'Bank already exists' });
		}
		// if not all required fields are filled
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		res.status(500).json({ message: 'Error creating bank' });
	}
}

async function deleteBank(req, res) {
	try {
		const { id } = req.params;

		// Delete the bank using the Bank model
		const rowsAffected = await Bank.destroy({ where: { id } });

		if (rowsAffected === 0) {
			return res.status(404).json({ message: 'Bank not found' });
		}

		res.status(200).json({ message: 'Bank deleted successfully' });
	} catch (error) {
		console.log(error);
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		res.status(500).json({ message: 'Error deleting bank' });
	}
}

async function updateBank(req, res) {
	try {
		const { id } = req.params;
		const { name, documents_required, logo_path } = req.body;

		// Update the bank using the Bank model
		const [rowCount] = await Bank.update(
			{ name, documents_required, logo_path },
			{ where: { id } }
		);

		if (rowCount === 0) {
			return res.status(404).json({ message: 'Bank not found' });
		}

		res.status(200).json({ message: 'Bank updated successfully' });
	} catch (error) {
		console.log(error);
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		res.status(500).json({ message: 'Error updating bank' });
	}
}

async function getDocsRequired(req, res) {
	try {
		const { bank_id } = req.body;

		// find the bank
		const bank = await Bank.findByPk(bank_id);

		if (!bank) {
			return res.status(404).json({ message: 'Bank not found' });
		}

		// find the documents required for the bank
		let bank_ids = Object.keys(bank.documents_required);
		const documentsRequired = await DocumentType.findAll({
			where: { id: bank_ids },
		});

		res.status(200).json({ message: 'Documents required retrieved successfully', documentsRequired });

	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving documents required' });
	}
}

async function getBanks(req, res) {
	try {
		// find all banks
		const banks = await Bank.findAll();


		const documentsRequired = banks.map(async (bank) => {
			let bank_ids = Object.keys(bank.documents_required);
			let doc = await DocumentType.findAll({
				where: { id: bank_ids },
			});
			return doc;
		});

		console.log(documentsRequired)


		res.status(200).json({ message: 'Banks retrieved successfully', banks, documentsRequired });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error retrieving banks' });
	}
}






module.exports = { createBank, deleteBank, updateBank, getDocsRequired, getBanks };