const express = require('express');
const { transactionController } = require('../controllers/transaction');
const router = express.Router();

// Fetch all transactions
// search route that receives a search query and returns the transactions that match the search query
router.get('/search/:searchQuery', transactionController.search);
router.get('/', transactionController.getAll);

module.exports = router;
