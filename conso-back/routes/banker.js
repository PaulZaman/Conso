// routes/banker.js

const express = require('express');
const router = express.Router();
const { authenticate } = require('../routes/auth');
const { createBanker, deleteBanker, getApplications, makeOffer, refuseOffer, getUserFromApplication } = require('../controllers/bankerController');


// create a new banker
router.post('/create', createBanker);

// delete a banker
router.delete('/delete', authenticate, deleteBanker);

// get applications for a banker
router.post('/applications', authenticate, getApplications)

// make an offer for an application
router.post('/offer', authenticate, makeOffer)

// refuse an offer for an application
router.post('/refuse', authenticate, refuseOffer)

// get user from application
router.post('/user', authenticate, getUserFromApplication)

module.exports = router;