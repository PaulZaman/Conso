// controllers/userController.js

const User = require('../models/UserModel');
const Document = require('../models/DocumentModel');
const Token = require('../models/TokenModel');
const transporter = require('../email');
const LoanApplications = require('../models/LoanApplicationModel');
const Banker = require('../models/BankerModel');
const Offer = require('../models/OfferModel');
const Bank = require('../models/BankModel');
const DocumentType = require('../models/DocumentTypeModel');
const bcrypt = require('bcrypt');

async function createUser(req, res) {
	try {
		const { firstname, lastname, dob, email, password, profile_image_path = "", salary = "" } = req.body;
		// check if the user is at least 18 years old
		const today = new Date();
		const birthDate = new Date(dob);
		let age = today.getFullYear() - birthDate.getFullYear();
		const month = today.getMonth() - birthDate.getMonth();
		if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		if (age < 18) {
			return res.status(500).json({ message: 'You must be at least 18 years old to register' });
		}

		// Create the user using the User model
		let hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ firstname, lastname, dob, email, password: hashedPassword, is_verified: false, profile_image_path, salary });

		// Send a verification email to the user
		sendVerificationMail(user.email, user.id);

		res.status(201).json({ message: 'User created successfully, you can now verify your account', user });
	} catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(500).json({ message: 'Email already exists' });
		}
		// if not all required fields are filled
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		res.status(500).json({ message: 'Error creating user' });
	}
}

async function deleteUser(req, res) {
	try {
		const { id } = req.body;
		// find documents owned by the user
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// find documents owned by the user
		const documents = await Document.findAll({ where: { user_id: id } });
		// delete documents owned by the user
		documents.forEach(async (document) => {
			await document.destroy();
		});

		// find tokens owned by the user
		const tokens = await Token.findAll({ where: { user_id: id } });
		// delete tokens owned by the user
		tokens.forEach(async (token) => {
			await token.destroy();
		});


		// delete the user
		await user.destroy();

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		console.log(error);
		res.status(500).json({ message: 'Error deleting user' });
	}
}

// Update a user
const updateUser = async (req, res) => {
	const { firstname, lastname, dob, email, password, id } = req.body;

	try {
		const user = await User.findByPk(id);

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		user.firstname = firstname;
		user.lastname = lastname;
		user.dob = dob;
		user.email = email;
		user.password = await bcrypt.hash(password, 10);

		await user.save();

		res.status(200).json({ message: 'User information updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update user information' });
	}
};

async function sendVerificationMail(email, id) {
	// create a verification token for this user
	const token = Math.floor(1000 + Math.random() * 9000);
	const mailOptions = {
		from: transporter.options.auth.user,
		to: email,
		subject: 'CONSO : Email Verification',
		text: 'Please verify your email by entering the following code: ' + token + ' in the app',
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);
		} else {
			console.log('Email sent:', info.response);
		}
	});
	// save the token
	await Token.create({ user_id: id, token, expiry: Date.now() + 3600000 });
}

async function validate(req, res) {
	try {
		const { user_id, token } = req.body;
		// find the user
		const user = await User.findByPk(user_id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		// check if the user is already verified
		if (user.is_verified) {
			return res.status(200).json({ message: 'User already verified' });
		}
		// find the token
		if (!token) {
			return res.status(404).json({ message: 'You need to provide a token to validate' });
		}
		// check if the token is valid
		const foundToken = await Token.findOne({ where: { user_id } });
		if (foundToken.token !== token) {
			return res.status(200).json({ message: 'Token is invalid' });
		}
		// update the user
		await User.update({ is_verified: true }, { where: { id: user_id } });
		// delete the token
		await Token.destroy({ where: { user_id } });
		res.status(200).json({ message: 'User verified successfully' });
	}
	catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error validating user' });
	}
}

async function getUser(req, res) {
	const { id } = req.body;
	try {
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ message: 'User found', user });
	} catch (error) {
		res.status(500).json({ message: 'Error getting user' });
	}
}

async function getUserApplications(req, res) {
	const { id } = req.body;
	try {
		// find the user
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		// check if the user is a banker
		const banker = await Banker.findOne({ where: { user_id: id } });
		if (banker) {
			return res.status(200).json({ message: 'User is a banker, bankers cannot apply for loans' });
		}
		// find the applications
		const applications = await LoanApplications.findAll({ where: { user_id: id } });
		res.status(200).json({ message: 'Found Applications', applications });
	} catch (error) {
		res.status(500).json({ message: 'Error getting user' });
	}
}

async function userIsBanker(req, res) {
	const { id } = req.body;
	try {
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const banker = await Banker.findOne({ where: { user_id: id } });
		if (!banker) {
			return res.status(200).json({ message: 'User is not a banker', result: false });
		}
		res.status(200).json({ message: 'User is a banker', result: true });
	} catch (error) {
		res.status(500).json({ message: 'Error getting user' });
	}
}

async function getOffer(req, res) {
	const { id, loan_application_id } = req.body;
	try {
		// find the user
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		// get the loan application
		const loanApplication = await LoanApplications.findByPk(loan_application_id);
		if (!loanApplication) {
			return res.status(404).json({ message: 'Loan application not found' });
		}
		// check if the application approved
		if (loanApplication.status !== 'approved') {
			return res.status(200).json({ message: 'Loan application not approved' });
		}
		// get the offer
		const offer = await Offer.findOne({ where: { loan_application_id } });
		if (!offer) {
			return res.status(404).json({ message: 'Offer not found' });
		}
		res.status(200).json({ message: 'Offer found', offer });
	}
	catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error getting offer' });
	}
}

async function checkDocuments(req, res) {
	const { id, bank_id } = req.body;
	try {
		// find the user
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		// get the bank
		const bank = await Bank.findByPk(bank_id);
		if (!bank) {
			return res.status(404).json({ message: 'Bank not found' });
		}
		// find the documents required for the bank
		let bank_ids = Object.keys(bank.documents_required);
		const documentsRequired = await DocumentType.findAll({
			where: { id: bank_ids },
		});
		// find the documents uploaded by the user
		const documentsUploaded = await Document.findAll({
			where: { user_id: id },
		});

		// check if the user has uploaded all the documents
		// get documents required types id
		let documentsRequiredTypesIds = documentsRequired.map((document) => document.id);
		// get documents uploaded types id
		let documentsUploadedTypesIds = documentsUploaded.map((document) => document.document_type_id);
		// check if the user has uploaded all the documents
		let notUploaded = documentsRequiredTypesIds.filter((document) => !documentsUploadedTypesIds.includes(document));
		// Associate not uploaded documents with their types

		let missingDocs = [];
		notUploaded.forEach((document) => {
			let doc = documentsRequired.find((doc) => doc.id === document);
			missingDocs.push(doc);
		});

		if (notUploaded.length > 0) {
			return res.status(200).json({ message: 'Documents not all uploaded', Missingdocuments: missingDocs });
		}

		res.status(200).json({ message: 'Documents checked' });
	}
	catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Error checking documents' });
	}
}

module.exports = {
	createUser,
	deleteUser,
	updateUser,
	validate,
	getUser,
	getUserApplications,
	userIsBanker,
	getOffer,
	checkDocuments
};
