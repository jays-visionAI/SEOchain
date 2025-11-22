import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import walletRoutes from './routes/wallet.routes';
import tokenRoutes from './routes/token.routes';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/ratelimit.middleware';
import { redisClient } from './utils/redis.client';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Initialize Redis connection
redisClient.connect().catch((error) => {
    console.error('Failed to connect to Redis:', error);
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    }
});

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(rateLimiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/token', tokenRoutes);

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await redisClient.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await redisClient.disconnect();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Polygon Network: ${process.env.POLYGON_NETWORK || 'mumbai'}`);
});

export default app;

