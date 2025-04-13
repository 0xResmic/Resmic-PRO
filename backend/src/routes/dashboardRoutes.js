const express = require('express');
const { getRecentTransactions, getUserStats, getUniqueAddressDetails, editUserTransaction, getTransactionByAddressORHash, getGraphStats } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/recent-txs', getRecentTransactions);
router.get('/stats', getUserStats);
router.get('/unique-users', getUniqueAddressDetails);
router.get('/graph', getGraphStats);
router.put('/edit-transaction', editUserTransaction);

router.get('/transaction-by-hash-address', getTransactionByAddressORHash);

module.exports = router;