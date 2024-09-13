const Transaction = require('../models/Transaction');

const transactionController = {
  getAll: async (req, res) => {
    try {
      const transactions = await Transaction.find();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions' });
    }
  },

  search: async (req, res) => {
    try {
      const { searchQuery } = req.params;

      // find in transaction model and return the result that match the search query, find in transaction's blockNumber or transactionHash, or tokenId, or user
      const transactions = await Transaction.find({
        $or: [
          { blockNumber: searchQuery },
          { transactionHash: searchQuery },
          { tokenId: searchQuery },
          { user: searchQuery },
          { type: searchQuery },
        ],
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions' });
    }
  }
}

module.exports = { transactionController };

