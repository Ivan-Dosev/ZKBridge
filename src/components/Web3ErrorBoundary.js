import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 9999;
`;

const ErrorContent = styled.div`
  background: #1a1b23;
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.3),
    0 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 40px -10px rgba(0, 242, 254, 0.3);
`;

const ErrorTitle = styled.h3`
  color: #ff4444;
  font-size: 24px;
  margin: 0 0 16px 0;
`;

const ErrorMessage = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 24px 0;
`;

const RetryButton = styled.button`
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
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

class Web3ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Web3 Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorTitle>Web3 Connection Error</ErrorTitle>
            <ErrorMessage>
              {this.state.error?.message || 'An error occurred while connecting to Web3. Please make sure you have MetaMask installed and try again.'}
            </ErrorMessage>
            <RetryButton onClick={this.handleRetry}>
              Retry Connection
            </RetryButton>
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default Web3ErrorBoundary; 