# Multi-Chain Bridge Deployment Guide

This guide explains how to deploy the NeoX bridge contracts to all supported networks.

## Supported Networks

1. **Sepolia Testnet** (ETH)
2. **Base Sepolia** (ETH)  
3. **Mantle Sepolia** (MNT)
4. **Flow Testnet** (FLOW)
5. **Ronin Testnet** (RON)
6. **Flare Testnet** (FLR)

## Environment Variables Setup

Add these variables to your `.env` file:

```bash
# Private key for deploying contracts
PRIVATE_KEY=your_private_key_here

# RPC URLs for different networks
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
BASE_SEPOLIA_RPC_URL=https://base-sepolia.infura.io/v3/your_infura_project_id

# API Keys for block explorers
ETHERSCAN_API_KEY=your_etherscan_api_key
BASESCAN_API_KEY=your_basescan_api_key

# Bridge Contract Addresses (add after deployment)
REACT_APP_SEPOLIA_BRIDGE_ADDRESS=your_sepolia_bridge_address
REACT_APP_BASE_SEPOLIA_BRIDGE_ADDRESS=your_base_sepolia_bridge_address
REACT_APP_MANTLE_SEPOLIA_BRIDGE_ADDRESS=your_mantle_sepolia_bridge_address
REACT_APP_FLOW_TESTNET_BRIDGE_ADDRESS=your_flow_testnet_bridge_address
REACT_APP_RONIN_TESTNET_BRIDGE_ADDRESS=your_ronin_testnet_bridge_address
REACT_APP_FLARE_TESTNET_BRIDGE_ADDRESS=your_flare_testnet_bridge_address
```

## Deployment Commands

Deploy to each network using these commands:

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy-multichain.js --network sepolia

# Deploy to Base Sepolia
npx hardhat run scripts/deploy-multichain.js --network base-sepolia

# Deploy to Mantle Sepolia
npx hardhat run scripts/deploy-multichain.js --network mantle-sepolia

# Deploy to Flow Testnet
npx hardhat run scripts/deploy-multichain.js --network flow-testnet

# Deploy to Ronin Testnet
npx hardhat run scripts/deploy-multichain.js --network ronin-testnet

# Deploy to Flare Testnet
npx hardhat run scripts/deploy-multichain.js --network flare-testnet
```

## Network Configurations

### Mantle Sepolia
- **Chain ID**: 5003 (0x138b)
- **RPC URL**: https://mantle-sepolia.g.alchemy.com/v2/Nh7Lh9HzrRrsOb1ED2H3WeTXiRXViUq1
- **Explorer**: https://sepolia.mantle.xyz
- **Native Token**: MNT

### Flow Testnet
- **Chain ID**: 545 (0x221)
- **RPC URL**: https://flow-testnet.g.alchemy.com/v2/Nh7Lh9HzrRrsOb1ED2H3WeTXiRXViUq1
- **Explorer**: https://testnet.flowdiver.io
- **Native Token**: FLOW

### Ronin Testnet
- **Chain ID**: 2021 (0x7e5)
- **RPC URL**: https://saigon-testnet.roninchain.com/rpc
- **Explorer**: https://saigon-explorer.roninchain.com
- **Native Token**: RON

### Flare Testnet
- **Chain ID**: 16 (0x10)
- **RPC URL**: https://coston-api.flare.network/ext/bc/C/rpc
- **Explorer**: https://coston-explorer.flare.network
- **Native Token**: FLR

## Post-Deployment Steps

1. **Update Environment Variables**: Add the deployed contract addresses to your `.env` file
2. **Add Liquidity**: Send some native tokens to each bridge contract for testing
3. **Test Transactions**: Perform test swaps between different networks
4. **Verify Contracts**: Use the appropriate block explorer to verify your contracts

## Testing Cross-Chain Swaps

After deployment, you can test swaps between any of the supported networks:

- ETH ↔ BASE ↔ MNT ↔ FLOW ↔ RON ↔ FLR

All swaps use 1:1 conversion with a 1% bridge fee applied to each transaction. 