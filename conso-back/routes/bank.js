// routes/bank.js

const express = require('express');
const router = express.Router();
const { authenticate } = require('../routes/auth');

const {
	createBank,
	deleteBank,
	updateBank,
	getDocsRequired,
	getBanks,
} = require('../controllers/bankController');

// Create a new bank
router.post('/create', authenticate, createBank);

// Delete a bank
router.delete('/delete/:id', authenticate, deleteBank);

// Update a bank
router.put('/update/:id', authenticate, updateBank);

// get documents required for a bank
router.get('/docs', getDocsRequired);

// get all banks with their documents required
router.get('/', getBanks);

module.exports = router;