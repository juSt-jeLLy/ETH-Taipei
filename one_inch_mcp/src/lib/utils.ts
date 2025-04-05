import { randomBytes } from "ethers";

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  chainId?: number;
  address?: string;
}

/**
 * Tool response structure
 */
export interface ToolResponse {
  content: { type: string; text: string }[];
  isError: boolean;
}

/**
 * Generates a random bytes32 value for use in cross-chain swaps
 * @returns Random bytes32 value with 0x prefix
 */
export function getRandomBytes32(): string {
  return '0x' + Buffer.from(randomBytes(32)).toString('hex');
}

/**
 * Formats the response from a tool to ensure consistent structure
 * @param data The data to format
 * @param isError Whether this is an error response
 * @returns Formatted tool response
 */
export function formatToolResponse(data: unknown, isError = false): ToolResponse {
  return {
    content: [{ 
      type: "text", 
      text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) 
    }],
    isError
  };
}

/**
 * Helper function to validate network input against supported networks
 * @param network Network name to validate
 * @param networkMap Map of supported networks
 * @returns Validation result with status and error message
 */
export function validateNetwork(network: string, networkMap: Record<string, number>): ValidationResult {
  const networkLower = network.toLowerCase();
  
  if (!networkMap[networkLower]) {
    return {
      valid: false,
      message: `Network '${network}' not supported or not found.`
    };
  }
  
  return { 
    valid: true, 
    chainId: networkMap[networkLower] 
  };
}

/**
 * Helper function to validate token input against supported tokens
 * @param network Network name 
 * @param token Token symbol to validate
 * @param tokenMap Map of supported tokens
 * @returns Validation result with status and error message
 */
export function validateToken(
  network: string, 
  token: string, 
  tokenMap: Record<string, Record<string, string>>
): ValidationResult {
  const networkLower = network.toLowerCase();
  const tokenUpper = token.toUpperCase();
  
  if (!tokenMap[networkLower]?.[tokenUpper]) {
    return {
      valid: false,
      message: `Token '${token}' not supported on ${network}.`
    };
  }
  
  return { 
    valid: true, 
    address: tokenMap[networkLower][tokenUpper] 
  };
}