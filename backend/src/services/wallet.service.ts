import { ethers } from 'ethers';

export interface WalletInfo {
    address: string;
    privateKey: string;
    mnemonic?: string;
}

export class WalletService {
    private provider: ethers.JsonRpcProvider;
    private chainId: number;

    constructor() {
        const rpcUrl = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        // Chain IDs: Mainnet = 137, Amoy = 80002 (Mumbai deprecated = 80001)
        this.chainId = process.env.POLYGON_NETWORK === 'mainnet' ? 137 : 80002;
    }

    /**
     * Create a new random wallet
     */
    async createWallet(): Promise<WalletInfo> {
        const wallet = ethers.Wallet.createRandom();

        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic?.phrase
        };
    }

    /**
     * Import wallet from private key
     */
    importWallet(privateKey: string): WalletInfo {
        const wallet = new ethers.Wallet(privateKey);

        return {
            address: wallet.address,
            privateKey: wallet.privateKey
        };
    }

    /**
     * Get wallet balance
     */
    async getBalance(address: string): Promise<string> {
        const balance = await this.provider.getBalance(address);
        return ethers.formatEther(balance);
    }

    /**
     * Get network information
     */
    async getNetworkInfo() {
        const network = await this.provider.getNetwork();
        const gasPrice = await this.provider.getFeeData();

        return {
            chainId: Number(network.chainId),
            name: network.name,
            gasPrice: {
                maxFeePerGas: gasPrice.maxFeePerGas ? ethers.formatUnits(gasPrice.maxFeePerGas, 'gwei') : null,
                maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas ? ethers.formatUnits(gasPrice.maxPriorityFeePerGas, 'gwei') : null
            }
        };
    }

    /**
     * Get provider instance
     */
    getProvider(): ethers.JsonRpcProvider {
        return this.provider;
    }

    /**
     * Get chain ID
     */
    getChainId(): number {
        return this.chainId;
    }

    /**
     * Verify if address is valid
     */
    isValidAddress(address: string): boolean {
        return ethers.isAddress(address);
    }

    /**
     * Get wallet from private key with provider
     */
    getWallet(privateKey: string): ethers.Wallet {
        return new ethers.Wallet(privateKey, this.provider);
    }
}

export default new WalletService();
