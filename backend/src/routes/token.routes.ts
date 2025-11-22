import { Router } from 'express';
import {
    deployToken,
    getTokenInfo,
    mintTokens,
    getTokenBalance
} from '../controllers/token.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { strictRateLimiter } from '../middleware/ratelimit.middleware';

const router = Router();

/**
 * @route   POST /api/token/deploy
 * @desc    Deploy a new ERC-20 token
 * @access  Private (requires authentication)
 */
router.post('/deploy', authenticateToken, strictRateLimiter, deployToken);

/**
 * @route   GET /api/token/:address/info
 * @desc    Get token information
 * @access  Public
 */
router.get('/:address/info', getTokenInfo);

/**
 * @route   POST /api/token/mint
 * @desc    Mint new tokens
 * @access  Private (requires authentication)
 */
router.post('/mint', authenticateToken, strictRateLimiter, mintTokens);

/**
 * @route   GET /api/token/balance
 * @desc    Get token balance for an address
 * @access  Public
 * @query   tokenAddress, walletAddress
 */
router.get('/balance', getTokenBalance);

export default router;
