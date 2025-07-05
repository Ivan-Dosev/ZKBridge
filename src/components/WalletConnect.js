import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import styled from 'styled-components';

// Remove supportedChainIds restriction to allow connection from any network
// Add error handling for null chain IDs
const injected = new InjectedConnector({
  supportedChainIds: undefined // Explicitly set to undefined to avoid chain ID validation
});

const WalletConnect = () => {
  const { active, account, activate, deactivate } = useWeb3React();
  const [accountState, setAccountState] = useState(null);

  // Network configurations for auto-switching
  const supportedNetworks = {
    5003: {
      chainId: '0x138B',
      chainName: 'Mantle Sepolia',
      nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
      rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
      blockExplorerUrls: ['https://sepolia.mantle.xyz']
    },
    545: {
      chainId: '0x221',
      chainName: 'Flow Testnet',
      nativeCurrency: { name: 'FLOW', symbol: 'FLOW', decimals: 18 },
      rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
      blockExplorerUrls: ['https://testnet.flowdiver.io']
    },
    2021: {
      chainId: '0x7e5',
      chainName: 'Ronin Testnet',
      nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
      rpcUrls: ['https://saigon-testnet.roninchain.com/rpc'],
      blockExplorerUrls: ['https://saigon-explorer.roninchain.com']
    },
    114: {
      chainId: '0x72',
      chainName: 'Flare Coston2',
      nativeCurrency: { name: 'C2FLR', symbol: 'C2FLR', decimals: 18 },
      rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
      blockExplorerUrls: ['https://coston2-explorer.flare.network']
    },
    2751645467413000: {
      chainId: '0x9c69b62a20a08',
      chainName: 'SagaTest',
      nativeCurrency: { name: 'SAGA', symbol: 'SAGA', decimals: 18 },
      rpcUrls: ['https://sagatest-2751645467413000-1.jsonrpc.sagarpc.io'],
      blockExplorerUrls: ['https://sagatest-2751645467413000-1.jsonrpc.sagarpc.io']
    },
    2751645565611000: {
      chainId: '0x9c69b687c6bf8',
      chainName: 'SagaDemo',
      nativeCurrency: { name: 'SAGAD', symbol: 'SAGAD', decimals: 18 },
      rpcUrls: ['https://sagademo-2751645565611000-1.jsonrpc.sagarpc.io'],
      blockExplorerUrls: ['https://sagademo-2751645565611000-1.jsonrpc.sagarpc.io']
    }
  };

  const switchToSupportedNetwork = async () => {
    try {
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      
      // Get current chain ID with error handling
      let currentChainId;
      try {
        currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      } catch (error) {
        console.warn('Could not get current chain ID:', error);
        // If we can't get chain ID, assume we need to switch to default
        currentChainId = '0x0';
      }
      
      const currentChainDecimal = currentChainId ? parseInt(currentChainId, 16) : 0;
      
      console.log('Current chain ID:', currentChainDecimal);
      
      // If already on a supported network, do nothing
      if (supportedNetworks[currentChainDecimal]) {
        console.log('Already on supported network');
        return true;
      }
      
      // Try to switch to Mantle Sepolia (default)
      const defaultNetwork = supportedNetworks[5003];
      console.log('Switching to Mantle Sepolia...');
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: defaultNetwork.chainId }],
        });
        console.log('Switched to Mantle Sepolia successfully');
        return true;
      } catch (switchError) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          console.log('Adding Mantle Sepolia network...');
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [defaultNetwork],
          });
          console.log('Added and switched to Mantle Sepolia');
          return true;
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // First switch to a supported network
        console.log('Switching to supported network...');
        await switchToSupportedNetwork();
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get accounts using eth_accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccountState(accounts[0]); // Set the first account
        activate(injected); // Activate the injected connector
        
        console.log('Wallet connected successfully');
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccountState(accounts[0]);
            
            // Add a small delay before activating to ensure MetaMask is ready
            setTimeout(() => {
              activate(injected).catch(error => {
                console.error('Error activating connector:', error);
              });
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };
    
    checkConnection();
  }, [activate]);

  return (
    <ConnectButton 
      onClick={active ? deactivate : connectWallet}
      data-wallet-connect
    >
      {active ? `Connected: ${accountState?.substring(0, 6)}...${accountState?.substring(accountState.length - 4)}` : 'Connect Wallet'}
    </ConnectButton>
  );
};

const ConnectButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default WalletConnect; 