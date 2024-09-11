require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {PRIVATE_KEY, BSC_API_KEY} = process.env;

module.exports = {
  solidity: "0.8.24",
  networks: {
    tBNB: {
      url: `https://bsc-testnet-rpc.publicnode.com`,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 97,
    },
  },
  etherscan: {
    apiKey: BSC_API_KEY
  }
};
