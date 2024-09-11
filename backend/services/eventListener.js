const { Web3 } = require("web3");
const contractAddress = require("../contracts/contract-address.json").Logic;
const contractLogicABI = require("../contracts/Logic.json").abi;
const Transaction = require("../models/Transaction");
const dotenv = require("dotenv");
dotenv.config();
const { PUBLICNODE_URL } = process.env;

const web3 = new Web3(PUBLICNODE_URL);
const contract = new web3.eth.Contract(contractLogicABI, contractAddress);
web3.eth.getBlockNumber() // current block number

const startListening = async () => {
  let events = [];

  const currentBlock = parseInt(await web3.eth.getBlockNumber());
  const lastTransaction = await Transaction.findOne().sort({ blockNumber: -1 });
  // const lastBlockNumber = lastTransaction ? parseInt(lastTransaction.blockNumber) : currentBlock;
  if (lastTransaction) {
    let lastBlockNumber = parseInt(lastTransaction.blockNumber);
    if (currentBlock > lastBlockNumber) {
      lastBlockNumber += 1;
      const blocks = currentBlock - lastBlockNumber;
      const CallNumbers = Math.ceil(blocks / 10000);
      for (let i = 0; i < CallNumbers; i++) {
        const fromBlock = lastBlockNumber + i * 10000;
        const toBlock = lastBlockNumber + (i + 1) * 10000;
        const event = await contract.getPastEvents("allEvents", {
          fromBlock,
          toBlock,
        });
        events = events.concat(event);
      }
    } else {
      return;
    }
  } else {
    const blocks = currentBlock - 43752444;
    const CallNumbers = Math.ceil(blocks / 10000);
    for (let i = 0; i < CallNumbers; i++) {
      const fromBlock = 43752444 + i * 10000;
      const toBlock = 43752444 + (i + 1) * 10000;
      const event = await contract.getPastEvents("allEvents", {
        fromBlock,
        toBlock,
      });
      events = events.concat(event);
    }
  }

  for (let event of events) {
    const { blockNumber, transactionHash } = event;
    const { timestamp, user, amount, tokenId } = event.returnValues;
    const receipt = await web3.eth.getTransactionReceipt(transactionHash);
    let gasUsed = receipt.gasUsed;
    gasUsed = gasUsed.toString();

    // Fetch transaction details to get gas price
    const tx = await web3.eth.getTransaction(transactionHash);
    let gasPrice = BigInt(tx.gasPrice);
    gasPrice = gasPrice.toString();

    // Calculate transaction fee
    let txnFee = (gasUsed * gasPrice).toString();
    const transaction = new Transaction({
      user,
      type: event.event,
      amount,
      timestamp,
      tokenId,
      transactionHash,
      gasUsed,
      gasPrice,
      blockNumber,
      txnFee,
    });
    await transaction.save();
  }
};

module.exports = { startListening };	