import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AppError } from '../middleware/error.middleware';
import { ApiResponse } from '../types';

/**
 * Generate nonce for SIWE authentication
 */
export const getNonce = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const nonce = await authService.generateNonce();

        res.json({
            success: true,
            data: { nonce }
        });
    } catch (error) {
        next(new AppError('Failed to generate nonce', 500));
    }
};

/**
 * Verify SIWE signature and return JWT token
 */
export const verifySignature = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const { message, signature } = req.body;

        if (!message || !signature) {
            throw new AppError('Message and signature are required', 400);
        }

        // Verify SIWE message and signature
        const { address, chainId } = await authService.verifySiweMessage(
            message,
            signature
        );

        // Generate JWT token
        const token = authService.generateToken(address, chainId);

        res.json({
            success: true,
            data: {
                token,
                address,
                chainId
            },
            message: 'Authentication successful'
        });
    } catch (error) {
        if (error instanceof Error) {
            next(new AppError(error.message, 401));
        } else {
            next(new AppError('Authentication failed', 401));
        }
    }
};

/**
 * Get current user information
 */
export const getCurrentUser = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        const user = (req as any).user;

        if (!user) {
            throw new AppError('Not authenticated', 401);
        }

        res.json({
            success: true,
            data: {
                address: user.address,
                chainId: user.chainId
            }
        });
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Failed to get user information', 500));
        }
    }
};

/**
 * Logout (client-side should delete token)
 */
export const logout = async (
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // by deleting the token. We just acknowledge the request.

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(new AppError('Logout failed', 500));
    }
};
