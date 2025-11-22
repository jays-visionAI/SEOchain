import { Router } from 'express';
import {
    getNonce,
    verifySignature,
    getCurrentUser,
    logout
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

/**
 * @route   GET /api/auth/nonce
 * @desc    Get a nonce for SIWE authentication
 * @access  Public
 */
router.get('/nonce', authRateLimiter, getNonce);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify SIWE signature and get JWT token
 * @access  Public
 */
router.post('/verify', authRateLimiter, verifySignature);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user information
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

export default router;
