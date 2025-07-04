require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    'mantle-sepolia': {
      url: "https://rpc.sepolia.mantle.xyz",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5003,
      gasPrice: "auto",
      gas: "auto"
    },
    'flow-testnet': {
      url: "https://testnet.evm.nodes.onflow.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 545,
      timeout: 60000
    },
    'ronin-testnet': {
      url: "https://saigon-testnet.roninchain.com/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 2021
    },
    'flare-coston2': {
      url: "https://coston2-api.flare.network/ext/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 114
    },
    'saga-test': {
      url: "https://sagatest-2751645467413000-1.jsonrpc.sagarpc.io",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 2751645467413000
    },
    'saga-demo': {
      url: "https://sagademo-2751645565611000-1.jsonrpc.sagarpc.io",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 2751645565611000
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      'base-sepolia': process.env.BASESCAN_API_KEY
    }
  },
  sourcify: {
    enabled: false
  }
}; 