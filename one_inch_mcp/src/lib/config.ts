// Network chain IDs
export const NETWORKS: Record<string, number> = {
    "ethereum": 1,
    "optimism": 10,
    "bsc": 56,
    "polygon": 137,
    "arbitrum": 42161,
    "avalanche": 43114,
    "gnosis": 100,
    "base": 8453,
    "linea": 59144,
    "zksync": 324,
    "scroll": 534352,
    "mantle": 5000,
    "blast": 81457
  };
  
  // Token address mappings by network
  export const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
    "ethereum": {
      "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    },
    "arbitrum": {
      "USDC": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      "USDT": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      "DAI": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
    },
    "optimism": {
      "USDC": "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      "USDT": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      "DAI": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
    },
    "base": {
      "USDC": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "USDT": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
      "DAI": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"
    },
    "polygon": {
      "USDC": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      "USDT": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      "DAI": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
    }
  };
  
  // API URLs
  export const API_CONFIG = {
    FUSION_API_URL: 'https://api.1inch.dev/fusion-plus',
    PORTFOLIO_API_URL: 'https://api.1inch.dev/portfolio/portfolio/v4'
  };
  
  // Environment variables interface
  export interface EnvConfig {
    WALLET_KEY: string;
    WALLET_ADDRESS: string;
    RPC_URL_BASE: string;
    DEV_PORTAL_KEY: string;
    PORTFOLIO_API_KEY: string;
  }
  
  // Load and validate environment variables
  export const ENV: EnvConfig = {
    WALLET_KEY: process.env.WALLET_KEY || '',
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || '',
    RPC_URL_BASE: process.env.RPC_URL_BASE || '',
    DEV_PORTAL_KEY: process.env.DEV_PORTAL_KEY || '',
    PORTFOLIO_API_KEY: process.env.PORTFOLIO_API_KEY || ''
  };