// routes/user.js
const express = require('express');
const router = express.Router();
const { createUser, deleteUser, updateUser, validate } = require('../controllers/userController');
const { authenticate } = require('../routes/auth');
const { CreateLoanApplication } = require('../controllers/LoanController');

// Create a new user
router.post('/create', createUser);

// Delete a user
router.delete('/delete/:id', authenticate, deleteUser);

// validate a user
router.post('/validate', validate);

// Update a user
router.put('/update/:id', authenticate, updateUser);

// Create a new loan application
router.post('/loan-application', CreateLoanApplication);

module.exports = router;