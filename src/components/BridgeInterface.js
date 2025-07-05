import React, { useState } from 'react';
import styled from 'styled-components';
import TokenSelector from './TokenSelector';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px); // Adjust for header/footer
  padding: 1rem;
`;

const BridgeContainer = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: #232b32;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 242, 254, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 242, 254, 0.1);
`;

const Title = styled.h3`
  color: #00f2fe;
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-size: 24px;
  font-weight: 500;
`;

const SwapSection = styled.div`
  margin: 1rem 0;
`;

const BridgeButton = styled.button`
  width: 100%;
  background: #00b8d9;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #00a0c0;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #4a5056;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const BridgeInterface = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('SAGA'); // Default token
  const [toToken, setToToken] = useState('MANTLE'); // Default token

  return (
    <PageWrapper>
      <BridgeContainer>
        <Title>ZK SWAP</Title>
        <SwapSection>
          <TokenSelector
            label="You send"
            amount={fromAmount}
            setAmount={setFromAmount}
            chainName="Neo X"
            selectedToken={fromToken}
          />
        </SwapSection>
        <SwapSection>
          <TokenSelector
            label="You receive"
            amount={toAmount}
            setAmount={setToAmount}
            chainName="Polygon"
            selectedToken={toToken}
          />
        </SwapSection>
        <BridgeButton disabled={!fromAmount}>
          Bridge Tokens
        </BridgeButton>
      </BridgeContainer>
    </PageWrapper>
  );
};

export default BridgeInterface; 