// routes/user.js
const express = require('express');
const router = express.Router();
const { createUser, deleteUser, updateUser, validate, getUser, getUserApplications, userIsBanker, getOffer } = require('../controllers/userController');
const { authenticate } = require('../routes/auth');
const { CreateLoanApplication, deleteLoanApplication } = require('../controllers/LoanController');

// get a user
router.post('/', authenticate, getUser);

// Create a new user
router.post('/create', createUser);

// Delete a user
router.delete('/delete', authenticate, deleteUser);

// validate a user
router.post('/validate', validate);

// Update a user
router.post('/update', authenticate, updateUser);

// Create a new loan application
router.post('/apply', authenticate, CreateLoanApplication);

router.post('/apply/del', authenticate, deleteLoanApplication);

// Get all loan applications of a user
router.post('/applications', authenticate, getUserApplications);

// Is the user a banker ?
router.post('/isBanker', authenticate, userIsBanker);

// Get the offer for a loan application
router.post('/offer', authenticate, getOffer);


module.exports = router;