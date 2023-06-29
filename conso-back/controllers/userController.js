// controllers/userController.js

const User = require('../models/UserModel');
const Document = require('../models/DocumentModel');
const Token = require('../models/TokenModel');
const transporter = require('../email');
const LoanApplications = require('../models/LoanApplicationModel');
const Banker = require('../models/BankerModel');
const Offer = require('../models/OfferModel');

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
		const user = await User.create({ firstname, lastname, dob, email, password, is_verified: false, profile_image_path, salary });

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

async function updateUser(req, res) {
	try {
		const {
			firstname = "",
			lastname = "",
			dob = "",
			email = "",
			password = "",
			old_password = "",
			profile_image_path = "",
			id
		} = req.body;
		// check if the user exists
		const user = await User.findByPk(id);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		// if old_password is provided, check if it matches the old password
		if (password) {
			if (!old_password) {
				return res.status(500).json({ message: 'Old password is required to change password' });
			}
			// check if the old password matches the one in the database
			if (!user.password == old_password) {
				return res.status(500).json({ message: 'Old password is incorrect' });
			}
			// change the password
			user.password = password;
		}
		// if the email is changed, send a verification email
		if (email && email !== user.email) {
			// check if the email already exists
			const user_with_same_email = await User.findOne({ where: { email } });
			if (user_with_same_email) {
				return res.status(500).json({ message: 'Email already exists' });
			}
			// update the email
			user.email = email;
			// send a verification email
			sendVerificationMail(email, id);
			// set the user as unverified
			user.is_verified = false;
		}
		// change the other fields
		if (firstname) {
			user.firstname = firstname;
		}
		if (lastname) {
			user.lastname = lastname;
		}
		if (dob) {
			user.dob = dob;
		}
		if (profile_image_path) {
			user.profile_image_path = profile_image_path;
		}
		res.status(200).json({ message: 'User updated successfully', user });
	} catch (error) {
		if (error.name === 'SequelizeValidationError') {
			return res.status(500).json({ message: error.errors[0].message });
		}
		res.status(500).json({ message: 'Error updating user' });
	}
}

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
		console.log(foundToken.token, token)
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
			return res.status(404).json({ message: 'User is not a banker', result: false });
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


module.exports = {
	createUser,
	deleteUser,
	updateUser,
	validate,
	getUser,
	getUserApplications,
	userIsBanker,
	getOffer
};
