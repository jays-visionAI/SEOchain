import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import authService from '../services/auth.service';
import { AppError } from './error.middleware';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            throw new AppError('Authentication token required', 401);
        }

        // Verify token
        const user = authService.verifyToken(token);

        // Attach user to request
        (req as AuthenticatedRequest).user = user;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else if (error instanceof Error) {
            next(new AppError('Invalid authentication token', 401));
        } else {
            next(new AppError('Authentication failed', 401));
        }
    }
};

/**
 * Optional authentication - doesn't fail if no token is provided
 */
export const optionalAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const user = authService.verifyToken(token);
            (req as AuthenticatedRequest).user = user;
        }

        next();
    } catch (error) {
        // If token is invalid, just continue without user
        next();
    }
};
