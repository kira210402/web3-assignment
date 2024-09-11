const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: String,
  type: String,
  amount: {
    type: String,
    default: null,
  },
  tokenId: {
    type: String,
    default: null,
  },
  timestamp: {
    type: String,
    default: null,
  },
  transactionHash: {
    type: String,
    default: null,
  },
  blockNumber: String,
  gasUsed: {
    type: String,
    default: null,
  },
  gasPrice: {
    type: String,
    default: null,
  },
  txnFee: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
