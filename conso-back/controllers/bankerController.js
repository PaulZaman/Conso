// controllers/bankerController.js

const Banker = require('../models/BankerModel');
const User = require('../models/UserModel');
const Bank = require('../models/BankModel');

async function createBanker(req, res) {
	const { firstname, lastname, email, password, bank_id, dob, profile_image_path = "", is_verified = false } = req.body;

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


module.exports = {
	createBanker,
	deleteBanker
};