import { JsonRpcProvider, Wallet, formatEther } from 'ethers';

// Polygon Amoy Testnet Configuration
export const CHAIN_ID = 80002;
export const RPC_URL = 'https://rpc-amoy.polygon.technology';

// Provider for read-only access
export const getProvider = () => {
    return new JsonRpcProvider(RPC_URL);
};

// Create a random new wallet
export const createLocalWallet = (): Wallet => {
    const wallet = Wallet.createRandom();
    return wallet.connect(getProvider()) as unknown as Wallet;
};

// Import wallet from private key
export const importWalletFromPrivateKey = (privateKey: string): Wallet => {
    try {
        // Ensure private key has 0x prefix
        const formattedKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
        const wallet = new Wallet(formattedKey);
        return wallet.connect(getProvider());
    } catch (error) {
        console.error('Invalid private key:', error);
        throw new Error('Invalid private key');
    }
};

// Get balance for an address
export const getBalance = async (address: string): Promise<bigint> => {
    const provider = getProvider();
    return await provider.getBalance(address);
};

// Get formatted balance (ETH/MATIC)
export const getFormattedBalance = async (address: string): Promise<string> => {
    const balance = await getBalance(address);
    return formatEther(balance);
};
