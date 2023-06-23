// routes/user.js
const express = require('express');
const router = express.Router();
const { createUser, deleteUser, updateUser, validate, getUser, getUserApplications } = require('../controllers/userController');
const { authenticate } = require('../routes/auth');
const { CreateLoanApplication } = require('../controllers/LoanController');

// Create a new user
router.post('/create', createUser);

// Delete a user
router.delete('/delete', authenticate, deleteUser);

// get a user
router.post('/get', authenticate, getUser);

// validate a user
router.post('/validate', validate);

// Update a user
router.post('/update', authenticate, updateUser);

// Create a new loan application
router.post('/apply', authenticate, CreateLoanApplication);

// Get all loan applications of a user
router.get('/apply', authenticate, getUserApplications);

module.exports = router;