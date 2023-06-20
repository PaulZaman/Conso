// routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Token = require('../models/TokenModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Secret key for JWT
const secret_key = crypto.randomBytes(32).toString('hex');
// Token expiry time (15 minutes)
const validationTime = 15 * 60 * 1000;

// Generate a JWT token
function generateToken(email) {
	return jwt.sign({ email }, secret_key, { expiresIn: '1h' });
}

router.post('/', async (req, res) => {
	const { email = "", password = "" } = req.body;
	try {
		// Find the user
		const user = await User.findOne({ where: { email } });

		if (!user) {
			// If the user does not exist, send an error message
			return res.status(404).json({ message: 'User not found' });
		}

		// Check if the password is correct
		const isPasswordCorrect = user.password === password;

		if (!isPasswordCorrect) {
			// If the password is incorrect, send an error message
			return res.status(401).json({ message: 'Incorrect password' });
		}

		// Find if the user has an existing token
		const existingToken = await Token.findOne({ where: { user_id: user.id } });

		if (existingToken) {
			// Delete the token if it exists
			await existingToken.destroy();
		}

		// check if the user account is verified
		if (!user.is_verified) {
			return res.status(401).json({ message: 'Account not verified' });
		}

		// Generate a new token
		const token = generateToken(email);

		// Save the token
		await Token.create({
			token,
			user_id: user.id,
			expiry: Date.now() + validationTime
		});

		res.status(200).json({
			message: 'Login successful',
			token,
			user_id: user.id,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error creating token' });
	}
});

async function authenticate(req, res, next) {
	// Check if the request contains a valid token
	const { token, id } = req.body;

	if (!token) {
		// If there is no token, send an unauthorized response
		return res
			.status(401)
			.json({ message: 'Unauthorized, provide a token for this route' });
	}

	try {
		const foundToken = await Token.findOne({ where: { user_id: id } });

		// Check if the token exists
		if (!foundToken) {
			return res.status(401).json({ message: 'No token for this userId' });
		}

		// Verify the token
		jwt.verify(token, secret_key, (err, decoded) => {
			if (err) {
				return res.status(401).json({ message: 'Invalid token' });
			}

			// Check if the token has expired
			if (foundToken.expiry < Date.now()) {
				// If the token has expired, delete it and send an unauthorized response
				foundToken.destroy();
				return res.status(401).json({ message: 'Token expired' });
			}

			// Update the expiry date
			foundToken.expiry = Date.now() + validationTime;
			foundToken.save();

			// Add the user object to the request for further processing
			req.user = decoded;
			next();
		});
	} catch (error) {
		// If the token is invalid or expired, send an unauthorized response
		return res.status(401).json({ message: 'Error' });
	}
}

module.exports = { router, authenticate };
