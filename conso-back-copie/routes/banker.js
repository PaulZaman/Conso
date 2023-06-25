// routes/banker.js

const express = require('express');
const router = express.Router();
const { authenticate } = require('../routes/auth');
const { createBanker, deleteBanker, getApplications, makeOffer, refuseOffer } = require('../controllers/bankerController');


// create a new banker
router.post('/create', createBanker);

// delete a banker
router.delete('/delete', authenticate, deleteBanker);

// get applications for a banker
router.get('/applications', authenticate, getApplications)

// make an offer for an application
router.post('/offer', authenticate, makeOffer)

// refuse an offer for an application
router.post('/refuse', authenticate, refuseOffer)

module.exports = router;