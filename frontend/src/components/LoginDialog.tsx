import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Box,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Wallet } from 'ethers';
import api from '../lib/api';
import { CHAIN_ID } from '../lib/web3';

interface LoginDialogProps {
    open: boolean;
    onClose: () => void;
    wallet: Wallet;
    onLoginSuccess: (token: string) => void;
}

// SIWE message builder (manual implementation)
function createSiweMessage(params: {
    domain: string;
    address: string;
    statement: string;
    uri: string;
    version: string;
    chainId: number;
    nonce: string;
    issuedAt: string;
}): string {
    return `${params.domain} wants you to sign in with your Ethereum account:
${params.address}

${params.statement}

URI: ${params.uri}
Version: ${params.version}
Chain ID: ${params.chainId}
Nonce: ${params.nonce}
Issued At: ${params.issuedAt} `;
}

export default function LoginDialog({
    open,
    onClose,
    wallet,
    onLoginSuccess,
}: LoginDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Get nonce from backend
            const { data: nonceData } = await api.get('/api/auth/nonce');
            const nonce = nonceData.data.nonce;

            // 2. Create SIWE message manually
            const messageText = createSiweMessage({
                domain: window.location.host,
                address: wallet.address,
                statement: 'Sign in to SEOchain with Ethereum',
                uri: window.location.origin,
                version: '1',
                chainId: CHAIN_ID,
                nonce,
                issuedAt: new Date().toISOString(),
            });

            // 3. Sign message with Local Wallet (ethers.Wallet)
            const signature = await wallet.signMessage(messageText);

            // 4. Verify signature and get JWT token
            const { data: authData } = await api.post('/api/auth/verify', {
                message: messageText,
                signature,
            });

            const token = authData.data.token;
            localStorage.setItem('auth_token', token);

            onLoginSuccess(token);
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.error || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    borderRadius: fullScreen ? 0 : 4,
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pt: 4, pb: 1 }}>
                <Typography variant="h5" fontWeight="700">Sign In with Ethereum</Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                        p: 2,
                        borderRadius: '16px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        mb: 3,
                        width: '100%'
                    }}>
                        <Typography variant="caption" color="text.secondary" gutterBottom display="block" align="center">
                            WALLET ADDRESS
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', textAlign: 'center', fontWeight: 600 }}>
                            {wallet.address}
                        </Typography>
                    </Box>

                    <Typography variant="body1" paragraph align="center" color="text.secondary">
                        Sign the authentication message with your local wallet to log in.
                    </Typography>

                    <Alert severity="success" sx={{ width: '100%', borderRadius: 2, mb: 2 }}>
                        Seamless Login: No popup required!
                    </Alert>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', borderRadius: 2, mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 4, flexDirection: 'column', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    fullWidth
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                >
                    {loading ? 'Signing...' : 'Sign Message'}
                </Button>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    fullWidth
                    color="inherit"
                    sx={{ ml: 0 }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
