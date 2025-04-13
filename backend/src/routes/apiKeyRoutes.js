const express = require('express');
const { generateAPIKey, getAPIKey, deleteAPIKey, updateAPIKey, deleteWebhookSecret, generateWebhookSecret } = require('../controllers/apiKeyController');

const router = express.Router();

router.post('/api-key', generateAPIKey);
router.delete('/api-key', deleteAPIKey);

router.get('/api-key', getAPIKey);

router.post('/webhook-secret', generateWebhookSecret);
router.delete('/webhook-secret', deleteWebhookSecret);

module.exports = router;