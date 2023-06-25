// controllers/bankerController.js

const Banker = require('../models/BankerModel');
const User = require('../models/UserModel');
const Bank = require('../models/BankModel');
const LoanApplication = require('../models/LoanApplicationModel');
const Offer = require('../models/OfferModel');
const { where } = require('sequelize');

async function createBanker(req, res) {
	const { firstname, lastname, email, password, bank_id, dob, profile_image_path = "", is_verified = true } = req.body;

	try {
		// check if the bank exists
		const bank = await Bank.findByPk(bank_id);
		if (!bank) {
			return res.status(404).json({ message: 'Bank not found' });
		}
		// check if user already exists
		const user = await User.findOne({ where: { email } });
		if (user) {
			return res.status(500).json({ message: 'Email already exists' });
		}

		// check if dob is at least 18 years ago
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

		// create the user
		const newUser = await User.create({ firstname, lastname, email, password, dob, profile_image_path, is_verified });

		// create the banker
		const banker = await Banker.create({ user_id: newUser.id, bank_id });

		res.status(201).json({ message: 'Banker created successfully', banker, user: newUser });
	}
	catch (error) {
		if (error.name === 'SequelizeUniqueConstraintError') {
			return res.status(500).json({ message: 'Email already exists' });
		}
		// if not all required fields are filled
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		res.status(500).json({ message: 'Error creating banker' });
	}
}

async function deleteBanker(req, res) {
	try {
		const { id } = req.params;
		// find banker
		const banker = await Banker.findByPk(id);
		if (!banker) {
			return res.status(404).json({ message: 'Banker not found' });
		}
	}
	catch (error) {
		res.status(500).json({ message: 'Error deleting banker' });
	}
}

async function getApplications(req, res) {
	try {
		const { id } = req.body;
		// find banker
		const banker = await Banker.findOne({ where: { user_id: id } });
		if (!banker) {
			return res.status(404).json({ message: 'Banker not found' });
		}
		// find bank
		const bank = await Bank.findByPk(banker.bank_id);
		if (!bank) {
			return res.status(404).json({ message: 'Bank not found' });
		}
		// find all applications for that bank
		const applications = await LoanApplication.findAll({ where: { bank_id: bank.id } });
		if (!applications) {
			return res.status(404).json({ message: 'No applications found' });
		}
		// make sure to check if no banker from this bank, has made an offer for the application
		res.status(200).json({ message: 'Applications found', applications });
	}
	catch (error) {
		res.status(500).json({ message: 'Error getting applications' });
	}
}

async function makeOffer(req, res) {
	try {
		const {
			loan_application_id,
			id,
			interest_rate,
		} = req.body;

		// find banker
		const banker = await Banker.findOne({ where: { user_id: id } });
		if (!banker) {
			return res.status(404).json({ message: 'id provided is not the one of a banker' });
		}
		// find application
		const application = await LoanApplication.findByPk(loan_application_id);
		if (!application) {
			return res.status(404).json({ message: 'Application not found' });
		}
		// check if banker is from the same bank as the application
		if (banker.bank_id !== application.bank_id) {
			return res.status(500).json({ message: 'You cannot make an offer for this application' });
		}
		// check if application is still pending
		if (application.status !== 'pending') {
			return res.status(500).json({ message: 'You cannot make an offer for this application' });
		}
		// check if interest rate is between 0 and 100
		if (interest_rate < 0 || interest_rate > 100) {
			return res.status(500).json({ message: 'Interest rate must be between 0 and 100' });
		}
		// check if a banker from this bank has already made an offer for this application
		// find all bankers from this bank
		const bankers = await Banker.findAll({ where: { bank_id: banker.bank_id } });
		// find all offers for this application
		const offers = await Offer.findAll({ where: { loan_application_id } });
		// check if any of the bankers from this bank has made an offer for this application
		for (let i = 0; i < offers.length; i++) {
			for (let j = 0; j < bankers.length; j++) {
				if (offers[i].banker_id === bankers[j].id) {
					return res.status(500).json({ message: 'A banker from this bank has already made an offer for this application' });
				}
			}
		}
		// create offer
		const offer = await Offer.create({ loan_application_id, interest_rate, banker_id: banker.id });

		// set status of application to approved
		await LoanApplication.update({ status: 'approved' }, { where: { id: loan_application_id } });

		res.status(201).json({ message: 'Offer created successfully', offer });
	}
	catch (e) {
		res.status(500).json({ message: 'Error making offer' });
	}
}

async function refuseOffer(req, res) {
	try {
		const {
			loan_application_id,
			id,
		} = req.body;
		// find banker
		const banker = await Banker.findOne({ where: { user_id: id } });
		if (!banker) {
			return res.status(404).json({ message: 'id provided is not the one of a banker' });
		}
		// find application
		const application = await LoanApplication.findByPk(loan_application_id);
		if (!application) {
			return res.status(404).json({ message: 'Application not found' });
		}
		// check if banker is from the same bank as the application
		if (banker.bank_id !== application.bank_id) {
			return res.status(500).json({ message: 'You cannot refuse an offer for this application, this application was not for your bank' });
		}
		// check if application is still pending
		if (application.status !== 'pending') {
			return res.status(500).json({ message: 'You cannot refuse an offer for this application, it is not pending' });
		}
		// set status of application to refused
		await LoanApplication.update({ status: 'refused' }, { where: { id: loan_application_id } });
		res.status(200).json({ message: 'Offer refused successfully' });
	}
	catch (e) {
		res.status(500).json({ message: 'Error refusing offer' });
	}
}


module.exports = {
	createBanker,
	deleteBanker,
	getApplications,
	makeOffer,
	refuseOffer,
};