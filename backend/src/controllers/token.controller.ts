import { Request, Response, NextFunction } from 'express';
import tokenService from '../services/token.service';
import { AppError } from '../middleware/error.middleware';
import { ApiResponse, TokenConfig } from '../types';

/**
 * Deploy a new ERC-20 token
 */
export const deployToken = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const { name, symbol, initialSupply, decimals } = req.body as TokenConfig;

        if (!name || !symbol || !initialSupply) {
            throw new AppError('Name, symbol, and initialSupply are required', 400);
        }

        const tokenAddress = await tokenService.deployToken({
            name,
            symbol,
            initialSupply,
            decimals
        });

        res.json({
            success: true,
            data: {
                address: tokenAddress,
                name,
                symbol
            },
            message: 'Token deployed successfully'
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else if (error instanceof Error) {
            next(new AppError(error.message, 500));
        } else {
            next(new AppError('Failed to deploy token', 500));
        }
    }
};

/**
 * Get token information
 */
export const getTokenInfo = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const { address } = req.params;

        if (!address) {
            throw new AppError('Token address is required', 400);
        }

        const tokenInfo = await tokenService.getTokenInfo(address);

        res.json({
            success: true,
            data: tokenInfo
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else if (error instanceof Error) {
            next(new AppError(error.message, 404));
        } else {
            next(new AppError('Failed to get token information', 500));
        }
    }
};

/**
 * Mint tokens
 */
export const mintTokens = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const { tokenAddress, recipient, amount, decimals } = req.body;

        if (!tokenAddress || !recipient || !amount) {
            throw new AppError('Token address, recipient, and amount are required', 400);
        }

        const txHash = await tokenService.mintTokens(
            tokenAddress,
            recipient,
            amount,
            decimals || 18
        );

        res.json({
            success: true,
            data: {
                transactionHash: txHash,
                tokenAddress,
                recipient,
                amount
            },
            message: 'Tokens minted successfully'
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else if (error instanceof Error) {
            next(new AppError(error.message, 500));
        } else {
            next(new AppError('Failed to mint tokens', 500));
        }
    }
};

/**
 * Get token balance for an address
 */
export const getTokenBalance = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const { tokenAddress, walletAddress } = req.query;

        if (!tokenAddress || !walletAddress) {
            throw new AppError('Token address and wallet address are required', 400);
        }

        const balance = await tokenService.getTokenBalance(
            tokenAddress as string,
            walletAddress as string
        );

        res.json({
            success: true,
            data: {
                tokenAddress,
                walletAddress,
                balance
            }
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else if (error instanceof Error) {
            next(new AppError(error.message, 500));
        } else {
            next(new AppError('Failed to get token balance', 500));
        }
    }
};
