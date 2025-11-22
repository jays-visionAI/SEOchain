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
    IconButton,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../lib/api';

interface CreateWalletDialogProps {
    open: boolean;
    onClose: () => void;
}

interface WalletData {
    address: string;
    privateKey: string;
    mnemonic?: string;
}

export default function CreateWalletDialog({ open, onClose }: CreateWalletDialogProps) {
    const [loading, setLoading] = useState(false);
    const [walletData, setWalletData] = useState<WalletData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleCreateWallet = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await api.post('/api/wallet/create');
            setWalletData(data.data);
        } catch (err: any) {
            console.error('Failed to create wallet:', err);
            setError(err.response?.data?.error || 'Failed to create wallet');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleDownload = () => {
        if (!walletData) return;

        const content = `SEOchain Wallet Information
⚠️ KEEP THIS INFORMATION SAFE AND PRIVATE! ⚠️

Address: ${walletData.address}

Private Key: ${walletData.privateKey}

${walletData.mnemonic ? `Mnemonic Phrase: ${walletData.mnemonic}` : ''}

Created: ${new Date().toISOString()}

⚠️ NEVER SHARE YOUR PRIVATE KEY OR MNEMONIC WITH ANYONE!
⚠️ ANYONE WITH THIS INFORMATION CAN ACCESS YOUR FUNDS!
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallet-${walletData.address.slice(0, 8)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClose = () => {
        setWalletData(null);
        setError(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
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
            <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                <Typography variant="h5" fontWeight="700">Create New Wallet</Typography>
            </DialogTitle>
            <DialogContent>
                {!walletData ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                            Create a new Ethereum wallet on Polygon Amoy testnet.
                        </Typography>
                        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, textAlign: 'left' }}>
                            ⚠️ Make sure to save your private key and mnemonic phrase securely!
                            You will not be able to recover your wallet without them.
                        </Alert>

                        {error && (
                            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ py: 2 }}>
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            ✅ Wallet created successfully!
                        </Alert>

                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            ⚠️ SAVE THIS INFORMATION NOW! You will not be able to see it again.
                        </Alert>

                        <Box sx={{ mb: 2, p: 2, background: 'rgba(0,0,0,0.2)', borderRadius: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Address
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flex: 1, fontWeight: 600 }}
                                >
                                    {walletData.address}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => handleCopy(walletData.address, 'address')}
                                    color={copied === 'address' ? 'success' : 'default'}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2, p: 2, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 3, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                            <Typography variant="subtitle2" color="error" gutterBottom fontWeight="700">
                                Private Key (Keep Secret!)
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flex: 1 }}
                                >
                                    {walletData.privateKey}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => handleCopy(walletData.privateKey, 'privateKey')}
                                    color={copied === 'privateKey' ? 'success' : 'default'}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>

                        {walletData.mnemonic && (
                            <>
                                <Box sx={{ mb: 2, p: 2, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 3, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <Typography variant="subtitle2" color="error" gutterBottom fontWeight="700">
                                        Mnemonic Phrase (Keep Secret!)
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontFamily: 'monospace', flex: 1 }}
                                        >
                                            {walletData.mnemonic}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleCopy(walletData.mnemonic!, 'mnemonic')}
                                            color={copied === 'mnemonic' ? 'success' : 'default'}
                                        >
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </>
                        )}

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<DownloadIcon />}
                            onClick={handleDownload}
                            sx={{ mt: 2, py: 1.5, borderRadius: 3 }}
                        >
                            Download Wallet Info
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 4, flexDirection: 'column', gap: 2 }}>
                {!walletData ? (
                    <>
                        <Button
                            variant="contained"
                            onClick={handleCreateWallet}
                            disabled={loading}
                            fullWidth
                            size="large"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{ py: 1.5, fontSize: '1.1rem' }}
                        >
                            {loading ? 'Creating...' : 'Create Wallet'}
                        </Button>
                        <Button onClick={handleClose} fullWidth color="inherit" sx={{ ml: 0 }}>
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button onClick={handleClose} variant="contained" fullWidth size="large">
                        Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
