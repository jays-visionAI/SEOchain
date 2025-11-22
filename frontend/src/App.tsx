import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import { Container, Box, AppBar, Toolbar, Typography, Button, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Grid, Card, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HubIcon from '@mui/icons-material/Hub';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 15, pb: 10 }}>
              {/* Hero Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80vh',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Decorative background elements */}
                <Box sx={{
                  position: 'absolute',
                  width: '600px',
                  height: '600px',
                  background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: -1,
                  filter: 'blur(60px)',
                }} />

                <Typography variant="h1" gutterBottom sx={{
                  fontWeight: 900,
                  mb: 3,
                  background: 'linear-gradient(to right, #fff, #94a3b8)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: { xs: '3rem', md: '5rem' },
                  letterSpacing: '-0.02em'
                }}>
                  Welcome to SEOchain
                </Typography>

                <Typography variant="h4" color="text.secondary" sx={{ mb: 8, maxWidth: '800px', lineHeight: 1.5, fontWeight: 400 }}>
                  The next generation <span style={{ color: '#8B5CF6', fontWeight: 700 }}>In-App Wallet</span> & Token Issuance Platform.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<KeyIcon />}
                  onClick={handleAccessWallet}
                  sx={{
                    py: 2.5,
                    px: 6,
                    fontSize: '1.3rem',
                    borderRadius: '50px',
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 40px rgba(139, 92, 246, 0.7)',
                    }
                  }}
                >
                  Access Wallet to Get Started
                </Button>
              </Box>

              {/* Features Section */}
              <Box>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 8 }}>
                  Core Features
                </Typography>
                <Grid container spacing={4}>
                  {[
                    {
                      title: '크로스체인 상호운용성',
                      desc: '다양한 블록체인 네트워크 간의 자산과 데이터를 자유롭게 이동하세요.',
                      icon: <HubIcon sx={{ fontSize: 50, color: '#8B5CF6' }} />
                    },
                    {
                      title: 'Intent Based Blockchain',
                      desc: '복잡한 트랜잭션 과정을 단순화하여 사용자의 의도(Intent)를 중심으로 작동합니다.',
                      icon: <PsychologyIcon sx={{ fontSize: 50, color: '#10B981' }} />
                    },
                    {
                      title: 'De-Fi, De-Pin, RWA 최적화',
                      desc: '실물 자산(RWA)과 탈중앙화 금융(DeFi)에 최적화된 인프라를 제공합니다.',
                      icon: <MonetizationOnIcon sx={{ fontSize: 50, color: '#F59E0B' }} />
                    }
                  ].map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 4,
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-10px)' }
                      }}>
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          {feature.desc}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Team Section */}
              <Box>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 8 }}>
                  Meet the Team
                </Typography>
                <Grid container spacing={4}>
                  {[
                    { name: 'Alex Kim', role: 'Lead Developer', color: '#8B5CF6' },
                    { name: 'Sarah Lee', role: 'Blockchain Architect', color: '#10B981' },
                    { name: 'Mike Chen', role: 'UI/UX Designer', color: '#F59E0B' },
                    { name: 'Jessica Park', role: 'Product Manager', color: '#EC4899' },
                    { name: 'David Wilson', role: 'Security Engineer', color: '#3B82F6' },
                    { name: 'Emily Zhang', role: 'Community Manager', color: '#6366F1' },
                  ].map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                        transition: 'all 0.3s',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.05)',
                          transform: 'scale(1.02)'
                        }
                      }}>
                        <Avatar sx={{
                          width: 70,
                          height: 70,
                          mr: 3,
                          bgcolor: member.color,
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">{member.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {member.role}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
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
