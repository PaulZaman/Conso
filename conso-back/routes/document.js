// routes/document.js

const express = require('express');

const router = express.Router();

const { getDocumentTypes, postDocumentUser, getDocumentsUser, getDocumentUser, deleteDocument } = require('../controllers/documentController');
const { authenticate } = require('../routes/auth');

// Post a document for a user
router.post('/', authenticate, postDocumentUser);

// Get all document Types
router.get('/types', getDocumentTypes);

// Get all documents for a user
router.post('/', authenticate, getDocumentsUser);

// Get a specific document for a user
router.post('/get', authenticate, getDocumentUser);

// Delete a document
router.delete('/', authenticate, deleteDocument);

module.exports = router;