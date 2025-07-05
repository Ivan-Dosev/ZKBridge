import { InjectedConnector } from '@web3-react/injected-connector';

// Remove supportedChainIds restriction to allow connection from any network
// Add error handling for null chain IDs
export const injected = new InjectedConnector({
  supportedChainIds: undefined // Explicitly set to undefined to avoid chain ID validation
}); 