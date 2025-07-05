# ZKBridge - Cross-Chain Bridge with Zero-Knowledge Proofs

A decentralized cross-chain bridge application that enables secure token transfers between different blockchain networks using zero-knowledge proofs.

## Features

- 🔒 Secure cross-chain transfers with ZK proofs
- 💱 Support for multiple networks:
  - Mantle Sepolia (Chain ID: 5003)
  - Flow Testnet (Chain ID: 545)
  - Ronin Testnet (Chain ID: 2021)
  - Flare Testnet (Chain ID: 114)
  - Saga Test/Demo networks
- 🌉 User-friendly bridge interface
- 💰 Staking functionality (coming soon)
- 🔄 Real-time price feeds via Supra Oracle

## Prerequisites

- Node.js v16+ (Note: v23.11.0 has some compatibility warnings with Hardhat)
- MetaMask or compatible Web3 wallet
- Test tokens on supported networks

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Ivan-Dosev/ZKBridge.git
cd ZKBridge
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PRIVATE_KEY=your_private_key
REACT_APP_MANTLE_SEPOLIA_BRIDGE_ADDRESS=your_bridge_address
REACT_APP_MANTLE_SEPOLIA_VERIFIER_ADDRESS=your_verifier_address
REACT_APP_FLOW_TESTNET_BRIDGE_ADDRESS=your_bridge_address
REACT_APP_RONIN_TESTNET_BRIDGE_ADDRESS=your_bridge_address
REACT_APP_FLARE_TESTNET_BRIDGE_ADDRESS=your_bridge_address
REACT_APP_SAGA_TEST_BRIDGE_ADDRESS=your_bridge_address
REACT_APP_SAGA_DEMO_BRIDGE_ADDRESS=your_bridge_address
```

## Smart Contract Deployment

1. Deploy to Mantle Sepolia:
```bash
npx hardhat run scripts/deploy.js --network mantle-sepolia
```

2. Deploy to other networks:
```bash
npx hardhat run scripts/deploy.js --network [network-name]
```

Available networks: `flow-testnet`, `ronin-testnet`, `flare-testnet`, `saga-test`, `saga-demo`

## Running the Frontend

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

### Smart Contracts
- `BridgeWithZKP.sol`: Main bridge contract handling deposits and withdrawals
- `TestVerifier.sol`: ZK proof verification contract
- `IZKPVerifier.sol`: Interface for verifier contracts
- `SupraOracle.sol`: Price feed integration

### Frontend Components
- `SwapInterface.js`: Main swap interface
- `BridgeInterface.js`: Bridge functionality
- `TokenSelector.js`: Token selection component
- `WalletConnect.js`: Wallet connection handling

## Testing

Run tests with Hardhat:
```bash
npx hardhat test
```

For specific test files:
```bash
npx hardhat test test/TokenSwap.test.js
```

## Security

- Zero-knowledge proofs ensure secure cross-chain transfers
- Nullifier hashes prevent double-spending
- Oracle integration for accurate price feeds
- Timelock mechanisms for added security

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Mantle Network
- Flow Blockchain
- Ronin Chain
- Flare Network
- Saga
- Supra Oracle

