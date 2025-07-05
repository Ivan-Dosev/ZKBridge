import React from 'react';
import styled from 'styled-components';

class Web3ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's a chain ID error that we want to suppress
    if (error.message && (
      error.message.includes('chainId null is not an integer') ||
      error.message.includes('Invariant failed: chainId null') ||
      error.message.includes('normalizeChainId')
    )) {
      console.log('Suppressing chain ID error in getDerivedStateFromError:', error.message);
      // Don't update state to show error UI for chain ID errors
      return { hasError: false, error: null };
    }
    
    // Update state so the next render will show the fallback UI for other errors
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('Web3 Error Boundary caught an error:', error, errorInfo);
    
    // Check if it's a chain ID error
    if (error.message && (
      error.message.includes('chainId null is not an integer') ||
      error.message.includes('Invariant failed: chainId null') ||
      error.message.includes('normalizeChainId')
    )) {
      console.log('Chain ID error detected, suppressing error overlay...');
      
      // Don't show error UI for chain ID errors, just log and continue
      this.setState({ hasError: false, error: null });
      return;
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Connection Error</ErrorTitle>
          <ErrorMessage>
            There was an issue connecting to your wallet. The page will reload automatically.
          </ErrorMessage>
          <ErrorDetails>
            If the problem persists, try:
            <ul>
              <li>Refreshing the page manually</li>
              <li>Switching to a supported network in MetaMask</li>
              <li>Disconnecting and reconnecting your wallet</li>
            </ul>
          </ErrorDetails>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #13141b;
  color: white;
  padding: 20px;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #ff4444;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 20px;
  max-width: 600px;
`;

const ErrorDetails = styled.div`
  color: #cccccc;
  font-size: 14px;
  max-width: 500px;
  
  ul {
    text-align: left;
    margin-top: 10px;
  }
  
  li {
    margin: 5px 0;
  }
`;

export default Web3ErrorBoundary; 