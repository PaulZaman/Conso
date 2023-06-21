// routes/banker.js

const express = require('express');
const router = express.Router();
const { authenticate } = require('../routes/auth');
const { createBanker, deleteBanker } = require('../controllers/bankerController');


// create a new banker
router.post('/create', createBanker);

// delete a banker
router.delete('/delete', authenticate, deleteBanker);

module.exports = router;