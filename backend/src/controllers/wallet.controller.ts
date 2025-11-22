import { Request, Response, NextFunction } from 'express';
import walletService from '../services/wallet.service';
import { AppError } from '../middleware/error.middleware';
import { ApiResponse } from '../types';

/**
 * Create a new wallet
 */
export const createWallet = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const wallet = await walletService.createWallet();

        res.json({
            success: true,
            data: wallet,
            message: 'Wallet created successfully. Please store the private key and mnemonic securely!'
        });
    } catch (error) {
        if (error instanceof Error) {
            next(new AppError(error.message, 500));
        } else {
            next(new AppError('Failed to create wallet', 500));
        }
    }
};

/**
 * Get wallet balance
 */
export const getBalance = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const { address } = req.params;

        if (!address) {
            throw new AppError('Wallet address is required', 400);
        }

        if (!walletService.isValidAddress(address)) {
            throw new AppError('Invalid wallet address', 400);
        }

        const balance = await walletService.getBalance(address);

        res.json({
            success: true,
            data: {
                address,
                balance,
                currency: 'MATIC'
            }
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else if (error instanceof Error) {
            next(new AppError(error.message, 500));
        } else {
            next(new AppError('Failed to get balance', 500));
        }
    }
};

/**
 * Get network information
 */
export const getNetworkInfo = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const networkInfo = await walletService.getNetworkInfo();

        res.json({
            success: true,
            data: networkInfo
        });
    } catch (error) {
        if (error instanceof Error) {
            next(new AppError(error.message, 500));
        } else {
            next(new AppError('Failed to get network information', 500));
        }
    }
};

/**
 * Validate wallet address
 */
export const validateAddress = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const { address } = req.body;

        if (!address) {
            throw new AppError('Address is required', 400);
        }

        const isValid = walletService.isValidAddress(address);

        res.json({
            success: true,
            data: {
                address,
                isValid
            }
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Failed to validate address', 500));
        }
    }
};
