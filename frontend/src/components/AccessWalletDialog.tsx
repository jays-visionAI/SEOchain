import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    Alert,
    Tab,
    Tabs,
    CircularProgress,
    IconButton,
    InputAdornment,
    useTheme,
    useMediaQuery
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { createLocalWallet, importWalletFromPrivateKey } from '../lib/web3';
import { Wallet } from 'ethers';

interface AccessWalletDialogProps {
    open: boolean;
    onClose: () => void;
    onWalletAccess: (wallet: Wallet) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`wallet-tabpanel-${index}`}
            aria-labelledby={`wallet-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function AccessWalletDialog({ open, onClose, onWalletAccess }: AccessWalletDialogProps) {
    const [tabValue, setTabValue] = useState(0);
    const [privateKey, setPrivateKey] = useState('');
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [newWallet, setNewWallet] = useState<{ address: string; privateKey: string; mnemonic: string } | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setError(null);
        setNewWallet(null);
        setPrivateKey('');
    };

    const handleImport = async () => {
        if (!privateKey) {
            setError('Please enter your private key');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const wallet = importWalletFromPrivateKey(privateKey);
            onWalletAccess(wallet);
            onClose();
        } catch (err: any) {
            console.error('Failed to import wallet:', err);
            setError('Invalid private key. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        setError(null);

        try {
            // Create a temporary wallet just to show the user (we don't use the backend API here for simplicity in this "client-side" flow, 
            // but in a real app we might want to use the backend if we want to track wallets. 
            // For "In-App Wallet" concept, client-side generation is often preferred for privacy.)
            // However, to match the previous "CreateWalletDialog" logic, we can use the helper from web3.ts

            const wallet = createLocalWallet();

            setNewWallet({
                address: wallet.address,
                privateKey: wallet.privateKey,
                mnemonic: (wallet as any).mnemonic?.phrase || 'No mnemonic available (Private Key only)'
            });

        } catch (err: any) {
            console.error('Failed to create wallet:', err);
            setError('Failed to create new wallet.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccessNewWallet = () => {
        if (newWallet) {
            const wallet = importWalletFromPrivateKey(newWallet.privateKey);
            onWalletAccess(wallet);
            onClose();
        }
    };

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
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
            <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                <Typography variant="h5" fontWeight="700">Access Wallet</Typography>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="wallet access tabs" variant="fullWidth">
                        <Tab label="Import Private Key" />
                        <Tab label="Create New Wallet" />
                    </Tabs>
                </Box>

                {/* Import Tab */}
                <TabPanel value={tabValue} index={0}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Enter your private key to access your existing wallet.
                    </Typography>

                    <TextField
                        fullWidth
                        label="Private Key"
                        variant="outlined"
                        type={showPrivateKey ? 'text' : 'password'}
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                                        edge="end"
                                    >
                                        {showPrivateKey ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        Your private key is stored locally in memory and is never sent to any server.
                    </Alert>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleImport}
                        disabled={loading || !privateKey}
                        sx={{ mt: 3, py: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Access Wallet'}
                    </Button>
                </TabPanel>

                {/* Create Tab */}
                <TabPanel value={tabValue} index={1}>
                    {!newWallet ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="body1" paragraph>
                                Generate a new secure Ethereum wallet locally.
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleCreate}
                                disabled={loading}
                                sx={{ py: 1.5, px: 4 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Generate New Wallet'}
                            </Button>
                        </Box>
                    ) : (
                        <Box>
                            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                ✅ Wallet generated successfully!
                            </Alert>

                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                ⚠️ SAVE THIS NOW! You cannot recover this wallet if you lose this key.
                            </Alert>

                            <Box sx={{ mb: 2, p: 2, background: 'rgba(0,0,0,0.2)', borderRadius: 3 }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                    Address
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }}>
                                        {newWallet.address}
                                    </Typography>
                                    <IconButton size="small" onClick={() => handleCopy(newWallet.address, 'addr')}>
                                        <ContentCopyIcon fontSize="small" color={copied === 'addr' ? 'success' : 'inherit'} />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2, p: 2, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 3, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <Typography variant="caption" color="error" gutterBottom fontWeight="bold">
                                    Private Key
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }}>
                                        {newWallet.privateKey}
                                    </Typography>
                                    <IconButton size="small" onClick={() => handleCopy(newWallet.privateKey, 'pk')}>
                                        <ContentCopyIcon fontSize="small" color={copied === 'pk' ? 'success' : 'inherit'} />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={handleAccessNewWallet}
                                sx={{ mt: 2, py: 1.5 }}
                            >
                                I Saved It, Access Wallet
                            </Button>
                        </Box>
                    )}
                </TabPanel>

            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} color="inherit" fullWidth>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
