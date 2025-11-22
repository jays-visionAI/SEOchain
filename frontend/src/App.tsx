import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import { Container, Box, AppBar, Toolbar, Typography, Button, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyIcon from '@mui/icons-material/Key';
import { Wallet } from 'ethers';
import WalletDashboard from './components/WalletDashboard';
import LoginDialog from './components/LoginDialog';
import AccessWalletDialog from './components/AccessWalletDialog';

// Premium Web3 Theme Configuration
const getDesignTokens = (mode: 'dark') => ({
  palette: {
    mode,
    primary: {
      main: '#8B5CF6', // Violet
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#0F172A', // Slate 900
      paper: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity for glassmorphism
    },
    text: {
      primary: '#F8FAFC', // Slate 50
      secondary: '#94A3B8', // Slate 400
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none' as const, fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(30, 41, 59, 0.6)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(15, 23, 42, 0.9)',
        },
      },
    },
  },
});

function App() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('auth_token')
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useMemo(() => createTheme(getDesignTokens('dark')), []);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAccessWallet = () => {
    setIsAccessDialogOpen(true);
  };

  const handleWalletAccessed = (accessedWallet: Wallet) => {
    setWallet(accessedWallet);
    setIsAccessDialogOpen(false);
    // Automatically open login dialog after wallet access
    setIsLoginDialogOpen(true);
  };

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    setIsLoginDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setAuthToken(null);
    setWallet(null);
    setMobileOpen(false);
  };

  const toggleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }} role="presentation">
      <List>
        <ListItem>
          <Typography variant="h6" sx={{ background: 'linear-gradient(45deg, #8B5CF6, #3B82F6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            SEOchain
          </Typography>
        </ListItem>
        {authToken && wallet ? (
          <>
            <ListItem>
              <ListItemText
                primary="Wallet Connected"
                secondary={`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                primaryTypographyProps={{ color: 'text.secondary', variant: 'caption' }}
                secondaryTypographyProps={{ color: 'text.primary', fontFamily: 'monospace' }}
              />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleAccessWallet}>
            <ListItemIcon><KeyIcon /></ListItemIcon>
            <ListItemText primary="Access Wallet" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: {
          backgroundImage: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 100%)',
          backgroundAttachment: 'fixed',
        }
      }} />

      <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position="sticky" elevation={0} sx={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ background: 'linear-gradient(45deg, #8B5CF6, #3B82F6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                ⛓️ SEOchain
              </span>
            </Typography>

            {!isMobile && (
              <Box>
                {authToken && wallet ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" display="block" color="text.secondary">Connected</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                      sx={{ borderRadius: '12px', borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      Logout
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<KeyIcon />}
                    onClick={handleAccessWallet}
                  >
                    Access Wallet
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={toggleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, background: '#0F172A' },
          }}
        >
          {drawer}
        </Drawer>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flex: 1 }}>
          {authToken && wallet ? (
            <WalletDashboard address={wallet.address} />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Decorative background elements */}
              <Box sx={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 70%)',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1,
                filter: 'blur(40px)',
              }} />

              <Typography variant="h2" gutterBottom sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(to right, #fff, #94a3b8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.75rem' }
              }}>
                Welcome to SEOchain
              </Typography>

              <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '600px', lineHeight: 1.6 }}>
                The next generation <span style={{ color: '#8B5CF6' }}>In-App Wallet</span> & Token Issuance Platform.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<KeyIcon />}
                onClick={handleAccessWallet}
                sx={{
                  py: 2,
                  px: 5,
                  fontSize: '1.2rem',
                  borderRadius: '50px',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
                }}
              >
                Access Wallet to Get Started
              </Button>
            </Box>
          )}
        </Container>

        <AccessWalletDialog
          open={isAccessDialogOpen}
          onClose={() => setIsAccessDialogOpen(false)}
          onWalletAccess={handleWalletAccessed}
        />

        {wallet && (
          <LoginDialog
            open={isLoginDialogOpen}
            onClose={() => setIsLoginDialogOpen(false)}
            wallet={wallet}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
