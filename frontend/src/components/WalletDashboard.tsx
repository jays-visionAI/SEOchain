import { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    CircularProgress,
    Alert,
    useTheme,
    useMediaQuery,
    Divider
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCardIcon from '@mui/icons-material/AddCard';
import TokenIcon from '@mui/icons-material/Token';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '../lib/api';
import { getBalance } from '../lib/web3';
import { formatEther } from 'ethers';
import CreateWalletDialog from './CreateWalletDialog';

interface WalletDashboardProps {
    address: string;
}

export default function WalletDashboard({ address }: WalletDashboardProps) {
    const [balance, setBalance] = useState<string>('0');
    const [networkInfo, setNetworkInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [createWalletOpen, setCreateWalletOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        loadWalletData();
    }, [address]);

    const loadWalletData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Get balance from blockchain
            const balanceWei = await getBalance(address);
            const balanceEth = formatEther(balanceWei);
            setBalance(parseFloat(balanceEth).toFixed(4));

            // Get network info from backend
            const { data } = await api.get('/api/wallet/network');
            setNetworkInfo(data.data);
        } catch (err: any) {
            console.error('Failed to load wallet data:', err);
            setError(err.message || 'Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={40} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                {error}
            </Alert>
        );
    }

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your wallets and assets
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Wallet Info Card */}
                <Grid item xs={12} md={7}>
                    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '150px',
                            height: '150px',
                            background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 70%)',
                            borderRadius: '50%',
                            transform: 'translate(30%, -30%)'
                        }} />

                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    color: '#8B5CF6',
                                    mr: 2
                                }}>
                                    <AccountBalanceWalletIcon />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>Your Wallet</Typography>
                                <Box sx={{ flexGrow: 1 }} />
                                <Button
                                    startIcon={<RefreshIcon />}
                                    size="small"
                                    onClick={loadWalletData}
                                    sx={{ borderRadius: '20px' }}
                                >
                                    Refresh
                                </Button>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Total Balance
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff' }}>
                                    {balance} <span style={{ fontSize: '1.5rem', color: '#94A3B8' }}>MATIC</span>
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Wallet Address
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '12px',
                                    fontFamily: 'monospace',
                                    fontSize: isMobile ? '0.8rem' : '1rem',
                                    wordBreak: 'break-all',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {address}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Network Info & Actions */}
                <Grid item xs={12} md={5}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        Network Status
                                    </Typography>

                                    {networkInfo && (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">Current Network</Typography>
                                                <Chip
                                                    label={networkInfo.name}
                                                    color="success"
                                                    size="small"
                                                    sx={{ fontWeight: 600, borderRadius: '8px' }}
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="text.secondary">Chain ID</Typography>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{networkInfo.chainId}</Typography>
                                            </Box>

                                            {networkInfo.gasPrice && (
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body2" color="text.secondary">Gas Price</Typography>
                                                    <Typography variant="body2">
                                                        {parseFloat(networkInfo.gasPrice.maxFeePerGas).toFixed(2)} Gwei
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Card sx={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        Quick Actions
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<AddCardIcon />}
                                            onClick={() => setCreateWalletOpen(true)}
                                            sx={{ py: 1.5 }}
                                        >
                                            Create New Wallet
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<TokenIcon />}
                                            disabled
                                            sx={{ py: 1.5, borderColor: 'rgba(255,255,255,0.2)' }}
                                        >
                                            Issue Token (Coming Soon)
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <CreateWalletDialog
                open={createWalletOpen}
                onClose={() => setCreateWalletOpen(false)}
            />
        </>
    );
}
