import { Router } from 'express';
import {
    createWallet,
    getBalance,
    getNetworkInfo,
    validateAddress
} from '../controllers/wallet.controller';
import { rateLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

/**
 * @route   POST /api/wallet/create
 * @desc    Create a new wallet
 * @access  Public
 */
router.post('/create', rateLimiter, createWallet);

/**
 * @route   GET /api/wallet/:address/balance
 * @desc    Get wallet balance
 * @access  Public
 */
router.get('/:address/balance', rateLimiter, getBalance);

/**
 * @route   GET /api/wallet/network
 * @desc    Get network information
 * @access  Public
 */
router.get('/network', rateLimiter, getNetworkInfo);

/**
 * @route   POST /api/wallet/validate
 * @desc    Validate wallet address
 * @access  Public
 */
router.post('/validate', rateLimiter, validateAddress);

export default router;
