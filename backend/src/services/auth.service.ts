import jwt from 'jsonwebtoken';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import { redisClient } from '../utils/redis.client';
import { NonceData } from '../types';

export class AuthService {
    private jwtSecret: string;
    private jwtExpiresIn: number = 60 * 60 * 24 * 7; // 7 days in seconds
    private nonceExpiresIn: number = 300; // 5 minutes in seconds

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';

        if (this.jwtSecret === 'default-secret-change-in-production' && process.env.NODE_ENV === 'production') {
            console.warn('WARNING: Using default JWT secret in production!');
        }
    }

    /**
     * Generate a random nonce for SIWE authentication
     */
    async generateNonce(): Promise<string> {
        const nonce = ethers.hexlify(ethers.randomBytes(16));

        // Store nonce in Redis with expiration (or in-memory if Redis unavailable)
        const nonceData: NonceData = {
            nonce,
            expiresAt: Date.now() + (this.nonceExpiresIn * 1000)
        };

        await redisClient.set(
            `nonce:${nonce}`,
            JSON.stringify(nonceData),
            this.nonceExpiresIn
        );

        return nonce;
    }

    /**
     * Verify SIWE message and signature
     */
    async verifySiweMessage(
        message: string,
        signature: string
    ): Promise<{ address: string; chainId: number }> {
        try {
            // Parse SIWE message
            const siweMessage = new SiweMessage(message);

            // Verify the nonce exists and is valid
            const nonceKey = `nonce:${siweMessage.nonce}`;
            const nonceData = await redisClient.get(nonceKey);

            if (!nonceData) {
                throw new Error('Invalid or expired nonce');
            }

            // Verify signature
            const fields = await siweMessage.verify({ signature });

            if (!fields.success) {
                throw new Error('Signature verification failed');
            }

            // Delete used nonce
            await redisClient.del(nonceKey);

            return {
                address: siweMessage.address,
                chainId: siweMessage.chainId
            };
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`SIWE verification failed: ${error.message}`);
            }
            throw new Error('SIWE verification failed');
        }
    }

    /**
     * Generate JWT token for authenticated user
     */
    generateToken(address: string, chainId: number): string {
        const payload = {
            address: address.toLowerCase(),
            chainId,
            iat: Math.floor(Date.now() / 1000)
        };

        const options: jwt.SignOptions = {
            expiresIn: this.jwtExpiresIn
        };

        return jwt.sign(payload, this.jwtSecret, options);
    }

    /**
     * Verify JWT token
     */
    verifyToken(token: string): { address: string; chainId: number } {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as {
                address: string;
                chainId: number;
            };

            return {
                address: decoded.address,
                chainId: decoded.chainId
            };
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    /**
     * Create SIWE message for client
     */
    createSiweMessage(
        domain: string,
        address: string,
        statement: string,
        uri: string,
        nonce: string,
        chainId: number
    ): string {
        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri,
            version: '1',
            chainId,
            nonce,
            issuedAt: new Date().toISOString()
        });

        return message.prepareMessage();
    }
}

export default new AuthService();
