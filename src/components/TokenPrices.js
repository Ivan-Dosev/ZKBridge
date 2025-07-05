import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchTokenPrices, formatPrice } from '../utils/priceFeeds';

const PricesWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
`;

const PricesContainer = styled.div`
  background: rgba(35, 43, 50, 0.7);
  border-radius: 20px;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem auto;
  color: white;
  width: 100%;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
`;

const PriceGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;
`;

const TokenPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  transition: all 0.2s ease;

  .symbol {
    color: #00f2fe;
    font-weight: 500;
  }

  .price {
    color: #ffffff;
    opacity: 0.9;
  }

  &:hover {
    background: rgba(0, 242, 254, 0.1);
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid rgba(0, 242, 254, 0.1);
  border-top: 2px solid #00f2fe;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  animation: spin 1s linear infinite;
  margin-left: 4px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  font-size: 0.8rem;
  padding: 0.25rem;
`;

const DEFAULT_PRICES = {
  FLR: 0.0167,
  SAGA: 0.20,
  MNT: 0.56,
  RON: 0.48,
  FLOW: 0.31
};

const TokenPrices = () => {
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const newPrices = await fetchTokenPrices();
        // Merge API prices with default prices, using default when API price is null/undefined
        setPrices(prevPrices => ({
          ...DEFAULT_PRICES,
          ...Object.fromEntries(
            Object.entries(newPrices).map(([key, value]) => [
              key,
              value || DEFAULT_PRICES[key]
            ])
          )
        }));
      } catch (err) {
        setError('Failed to fetch prices');
        console.error('Price fetch error:', err);
        // Keep using default prices on error
        setPrices(DEFAULT_PRICES);
      } finally {
        setLoading(false);
      }
    };

    updatePrices();
    const interval = setInterval(updatePrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const renderPrice = (symbol) => (
    <TokenPrice key={symbol}>
      <span className="symbol">{symbol}</span>
      <span className="price">
        {loading ? (
          <LoadingSpinner />
        ) : (
          `$${formatPrice(prices[symbol])}`
        )}
      </span>
    </TokenPrice>
  );

  return (
    <PricesWrapper>
      <PricesContainer>
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <PriceGrid>
            {renderPrice('FLR')}
            {renderPrice('SAGA')}
            {renderPrice('MNT')}
            {renderPrice('RON')}
            {renderPrice('FLOW')}
          </PriceGrid>
        )}
      </PricesContainer>
    </PricesWrapper>
  );
};

export default TokenPrices; 