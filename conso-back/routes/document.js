// routes/document.js

const express = require('express');

const router = express.Router();

const { getDocumentTypes, postDocumentUser, getDocumentsUser } = require('../controllers/documentController');
const { authenticate } = require('../routes/auth');

// Post a document for a user
router.post('/', authenticate, postDocumentUser);

// Get all document Types
router.get('/types', getDocumentTypes);

// Get all documents for a user
router.get('/', authenticate, getDocumentsUser);

module.exports = router;