import axios from 'axios';

const CMC_API_KEY = 'ec2786ad-c6e4-4703-a697-58612ef0e1fa';

// Token IDs from CoinMarketCap
const TOKEN_IDS = {
  SAGA: '28004',     // SAGA - Saga
  FLOW: '4558',      // FLOW - Flow
  MANTLE: '27075',   // MNT - Mantle
  RONIN: '14101',    // RON - Ronin
  SAGAD: '28004'     // SAGAD - Using same ID as SAGA for demo
};

// Fallback prices in case API fails
const FALLBACK_PRICES = {
  SAGA: 0.20,        // Updated to correct current price
  FLOW: 0.31,        // Updated based on current price
  MANTLE: 0.56,      // Updated based on current price
  RONIN: 0.48,       // Updated based on current price
  SAGAD: 0.20        // Same as SAGA for demo
};

export const fetchTokenPrices = async () => {
  // Temporarily disabled CoinMarketCap API calls
  /*
  try {
    const response = await axios.get(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        },
        params: {
          id: Object.values(TOKEN_IDS).join(','),
          convert: 'USD'
        },
        validateStatus: () => true // Accept any status code
      }
    );

    // If we get valid data, use it; otherwise, use fallback prices
    if (response?.data?.data) {
      const prices = {};
      for (const [token, id] of Object.entries(TOKEN_IDS)) {
        const tokenData = response.data.data[id];
        prices[token] = tokenData?.quote?.USD?.price || FALLBACK_PRICES[token];
      }
      return prices;
    }
  } catch {
    // Silently catch any errors
  }
  */
  
  // Return fallback prices for now
  return FALLBACK_PRICES;
};

// Function to format price with appropriate decimals
export const formatPrice = (price) => {
  if (price === null || price === undefined) return 'N/A';
  if (price < 0.01) return price.toFixed(6);
  if (price < 1) return price.toFixed(4);
  return price.toFixed(2);
}; 