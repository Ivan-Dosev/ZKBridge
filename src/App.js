import React, { useState } from 'react';
import styled from 'styled-components';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import SwapInterface from './components/SwapInterface';
import WalletConnect from './components/WalletConnect';
import Web3ErrorBoundary from './components/Web3ErrorBoundary';
import TokenPrices from './components/TokenPrices';

// Token data with all supported networks
export const tokens = [
  {
    symbol: 'SAGA',
    name: 'SagaTest',
    network: 'saga-test',
    chainId: '0x9c69b62a20a08', // SagaTest chain ID (2751645467413000)
    bridgeAddress: process.env.REACT_APP_SAGA_TEST_BRIDGE_ADDRESS
  },
  {
    symbol: 'FLOW',
    name: 'Flow Testnet',
    network: 'flow-testnet',
    chainId: '0x221', // Flow Testnet chain ID (545)
    bridgeAddress: process.env.REACT_APP_FLOW_TESTNET_BRIDGE_ADDRESS
  },
  {
    symbol: 'MNT',
    name: 'Mantle Sepolia',
    network: 'mantle-sepolia',
    chainId: '0x138B', // Mantle Sepolia chain ID (5003)
    bridgeAddress: process.env.REACT_APP_MANTLE_SEPOLIA_BRIDGE_ADDRESS
  },
  {
    symbol: 'RON',
    name: 'Ronin Testnet',
    network: 'ronin-testnet',
    chainId: '0x7e5', // Ronin Testnet chain ID (2021)
    bridgeAddress: process.env.REACT_APP_RONIN_TESTNET_BRIDGE_ADDRESS
  },
  {
    symbol: 'SAGAD',
    name: 'SagaDemo',
    network: 'saga-demo',
    chainId: '0x9c69b687c6bf8', // SagaDemo chain ID (2751645565611000)
    bridgeAddress: process.env.REACT_APP_SAGA_DEMO_BRIDGE_ADDRESS
  }
];

function getLibrary(provider) {
  try {
    return new ethers.BrowserProvider(provider);
  } catch (error) {
    console.error('Error creating provider:', error);
    // Return a fallback provider or null
    return null;
  }
}

function App() {
  const [selectedTokens, setSelectedTokens] = useState({
    from: 'MNT',
    to: 'SAGA'
  });

  const handleTokenSelect = (type, token) => {
    setSelectedTokens(prev => ({
      ...prev,
      [type]: token
    }));
  };

  return (
    <Web3ErrorBoundary>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AppContainer>
          <ContentContainer>
            <WalletConnect />
            <TokenPrices />
            <SwapInterface
              availableTokens={tokens}
              selectedTokens={selectedTokens}
              onTokenSelect={handleTokenSelect}
              setSelectedTokens={setSelectedTokens}
              style={{ alignSelf: 'flex-start' }}
            />
          </ContentContainer>
        </AppContainer>
      </Web3ReactProvider>
    </Web3ErrorBoundary>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #13141b;
  padding: 20px;
  position: relative;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 800px;
  width: 100%;

  > * {
    width: 100%;
    max-width: 480px;
  }

  /* Price bar should be full width */
  > *:nth-child(2) {
    max-width: 800px;
  }
`;

export default App; 