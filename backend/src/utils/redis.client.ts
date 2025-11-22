import { createClient, RedisClientType } from 'redis';

class RedisClient {
    private static instance: RedisClient;
    private client: RedisClientType;
    private isConnected: boolean = false;
    private useMemory: boolean = false;
    private memoryStore: Map<string, string> = new Map();

    private constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        this.client.on('error', (err) => {
            // Only log error if we haven't switched to memory mode yet
            if (!this.useMemory) {
                console.error('Redis Client Error', err);
            }
            if (!this.isConnected) {
                console.log('Switching to in-memory storage mode');
                this.useMemory = true;
            }
        });

        this.client.on('connect', () => {
            console.log('Redis Client Connected');
            this.isConnected = true;
            this.useMemory = false;
        });
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public async connect(): Promise<void> {
        if (!this.isConnected && !this.useMemory) {
            try {
                await this.client.connect();
            } catch (error) {
                console.log('Failed to connect to Redis, using in-memory storage');
                this.useMemory = true;
            }
        }
    }

    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
        }
    }

    public async set(key: string, value: string, expireSeconds?: number): Promise<void> {
        if (this.useMemory) {
            this.memoryStore.set(key, value);
            if (expireSeconds) {
                setTimeout(() => {
                    this.memoryStore.delete(key);
                }, expireSeconds * 1000);
            }
            return;
        }

        if (expireSeconds) {
            await this.client.set(key, value, { EX: expireSeconds });
        } else {
            await this.client.set(key, value);
        }
    }

    public async get(key: string): Promise<string | null> {
        if (this.useMemory) {
            return this.memoryStore.get(key) || null;
        }
        return await this.client.get(key);
    }

    public async del(key: string): Promise<void> {
        if (this.useMemory) {
            this.memoryStore.delete(key);
            return;
        }
        await this.client.del(key);
    }
}

export const redisClient = RedisClient.getInstance();
