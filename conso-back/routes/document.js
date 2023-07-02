// routes/document.js

const express = require('express');

const router = express.Router();

const { getDocumentTypes, getOrPostDocumentsUser, getDocumentUser, deleteDocument } = require('../controllers/documentController');
const { authenticate } = require('../routes/auth');

// Get all document Types
router.get('/types', getDocumentTypes);

// Get all documents for a user
router.post('/', authenticate, getOrPostDocumentsUser);

// Delete a document
router.delete('/', authenticate, deleteDocument);

module.exports = router;