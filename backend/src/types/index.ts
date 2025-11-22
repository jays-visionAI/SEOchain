import { Request } from 'express';

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        address: string;
        chainId: number;
    };
}

/**
 * SIWE Message data structure
 */
export interface SiweMessageData {
    domain: string;
    address: string;
    statement: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
}

/**
 * Token deployment configuration
 */
export interface TokenConfig {
    name: string;
    symbol: string;
    initialSupply: string;
    decimals?: number;
}

/**
 * Token information response
 */
export interface TokenInfo {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Nonce storage structure
 */
export interface NonceData {
    nonce: string;
    expiresAt: number;
}
