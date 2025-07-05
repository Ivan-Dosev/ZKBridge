import React from 'react';
import styled from 'styled-components';

const TokenContainer = styled.div`
  background: #2c353d;
  border-radius: 12px;
  padding: 1rem;
`;

const TokenHeader = styled.div`
  color: #8f96a1;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TokenInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: #4a5056;
  }
`;

const PriceDisplay = styled.div`
  color: #00f2fe;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  opacity: 0.8;
`;

const TokenSelector = ({ label, amount, setAmount, chainName, selectedToken }) => {
  // Get price based on token
  const getTokenPrice = (token) => {
    const prices = {
      FLARE: 0.0167,
      SAGA: 0.20,
      MANTLE: 0.56,
      RONIN: 0.48,
      FLOW: 0.31
    };
    return prices[token] || 0;
  };

  return (
    <TokenContainer>
      <TokenHeader>{label} on {chainName}</TokenHeader>
      <TokenInput
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {selectedToken && (
        <PriceDisplay>
          1 {selectedToken} = ${getTokenPrice(selectedToken)}
        </PriceDisplay>
      )}
    </TokenContainer>
  );
};

export default TokenSelector; 