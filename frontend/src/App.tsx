import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import { Container, Box, AppBar, Toolbar, Typography, Button, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Grid, Card, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HubIcon from '@mui/icons-material/Hub';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

        <Container maxWidth="xl" sx={{ mt: 0, mb: 8, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {authToken && wallet ? (
            <WalletDashboard address={wallet.address} />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 15, pb: 10, width: '100%', maxWidth: '1400px' }}>
              {/* Hero Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '90vh',
                  textAlign: 'center',
                  position: 'relative',
                  width: '100%',
                }}
              >
                {/* Decorative background elements */}
                <Box sx={{
                  position: 'absolute',
                  width: '800px',
                  height: '800px',
                  background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: -1,
                  filter: 'blur(80px)',
                }} />

                <Typography variant="h1" gutterBottom sx={{
                  fontWeight: 900,
                  mb: 3,
                  background: 'linear-gradient(to right, #fff, #94a3b8)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: { xs: '3rem', md: '6rem' },
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1
                }}>
                  Unleash the Limit<br />of Blockchain
                </Typography>

                <Typography variant="h5" color="text.secondary" sx={{ mb: 8, maxWidth: '900px', lineHeight: 1.6, fontWeight: 400, fontSize: { xs: '1.1rem', md: '1.4rem' } }}>
                  Vision Chain is a network-agnostic, enterprise-friendly Layer-1 for cross-chain dApps.
                  With AI routing, zk security, and intent-centric execution, it connects EVM and non-EVM without any bridges.
                  <br /><span style={{ color: '#8B5CF6', fontWeight: 700 }}>Build once. Run everywhere.</span>
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
              <Box sx={{ width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 2 }}>
                  Values that sets us apart
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, fontWeight: 400 }}>
                  Network Agnostic + AI Agentic Sequencing + Intent-Centric Execution
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                  {[
                    {
                      title: 'Network Agnostic',
                      desc: 'Connects EVM and non-EVM without any bridges. VCN powers Vision Chain’s network-agnostic Layer-1, aligning validators and developers.',
                      icon: <HubIcon sx={{ fontSize: 50, color: '#8B5CF6' }} />
                    },
                    {
                      title: 'AI Agentic Sequencing',
                      desc: 'AI optimizes ordering and routing to cut MEV, failures, and fees. Experience intelligent transaction management.',
                      icon: <PsychologyIcon sx={{ fontSize: 50, color: '#10B981' }} />
                    },
                    {
                      title: 'Intent-Centric Execution',
                      desc: 'Vision Chain handles route, tokens, approvals, gas, and cross-chain settlement—compliance-aware by design.',
                      icon: <MonetizationOnIcon sx={{ fontSize: 50, color: '#F59E0B' }} />
                    }
                  ].map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 5,
                        transition: 'transform 0.3s',
                        background: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': { transform: 'translateY(-10px)', background: 'rgba(30, 41, 59, 0.6)' }
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

              {/* Token Section */}
              <Box sx={{ width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 8 }}>
                  Token Utility (VCN)
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                  {[
                    { title: 'Gas Fees', desc: 'Pay for transaction fees across all connected chains.' },
                    { title: 'Governance', desc: 'Vote on protocol upgrades and parameter changes.' },
                    { title: 'Staking', desc: 'Secure the network and earn rewards by staking VCN.' },
                    { title: 'Settlement', desc: 'Used for cross-chain value settlement and liquidity.' },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box sx={{
                        p: 4,
                        borderRadius: 4,
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        textAlign: 'center',
                        height: '100%'
                      }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Roadmap Section */}
              <Box sx={{ width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 8 }}>
                  Roadmap
                </Typography>
                <Grid container spacing={4}>
                  {[
                    {
                      period: 'Q3 2025',
                      items: ['Token Distribution System Release', 'AI Agentic Node Release', 'EVM Cross-Chain Integration']
                    },
                    {
                      period: 'Q4 2025',
                      items: ['Exchange Listing', 'No Code SDK Release', 'BTC Cross-Chain Integration', 'Vision Scan BETA Launch']
                    },
                    {
                      period: 'Q1 2026',
                      items: ['Vision Chain Academy Open', 'Testnet Release', 'Agentic DAO BETA Release']
                    },
                    {
                      period: 'Q2 2026',
                      items: ['Exchange Listing', 'Validator Node Release', 'Mainnet Release', 'Vision Chain Hackathon']
                    },
                    {
                      period: 'Q3 2026',
                      items: ['Agentic DAO Release', 'dApp Accelerator Program Release']
                    }
                  ].map((phase, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card sx={{
                        p: 4,
                        height: '100%',
                        background: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        overflow: 'visible'
                      }}>
                        <Box sx={{
                          position: 'absolute',
                          top: -15,
                          left: 20,
                          background: '#8B5CF6',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}>
                          {phase.period}
                        </Box>
                        <List dense>
                          {phase.items.map((item, i) => (
                            <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }} />
                              </ListItemIcon>
                              <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
                            </ListItem>
                          ))}
                        </List>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* FAQ Section */}
              <Box sx={{ width: '100%', maxWidth: '1000px' }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 8 }}>
                  We’ve got the answers
                </Typography>
                {[
                  {
                    q: 'What does “Network-Agnostic” mean?',
                    a: 'Vision Chain works across EVM and non-EVM chains without wrapped tokens or custodial bridges, automatically choosing the best route.'
                  },
                  {
                    q: 'Who is Vision Chain for?',
                    a: 'It is designed for developers building cross-chain dApps, enterprises needing secure blockchain integration, and users seeking seamless asset transfers.'
                  },
                  {
                    q: 'How is cross-chain execution kept safe?',
                    a: 'We utilize Zero-Knowledge (zk) proofs and AI-driven routing to ensure transaction validity and security without relying on centralized validators.'
                  },
                  {
                    q: 'What is Intent-Centric Execution?',
                    a: 'Users simply specify their desired outcome (e.g., "Swap ETH for BTC"), and Vision Chain’s AI agents handle the complex routing, gas fees, and execution.'
                  },
                  {
                    q: 'Is it enterprise-ready?',
                    a: 'Yes, Vision Chain offers built-in integrations for ERP and accounting systems, making it suitable for large-scale business operations.'
                  },
                  {
                    q: 'What is VCN used for?',
                    a: 'VCN is the native utility token used for gas fees, governance voting, staking for network security, and cross-chain settlement.'
                  }
                ].map((faq, index) => (
                  <Accordion key={index} sx={{
                    mb: 2,
                    background: 'rgba(30, 41, 59, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    '&:before': { display: 'none' },
                    borderRadius: '12px !important'
                  }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}>
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{faq.q}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {faq.a}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>

              {/* Team Section */}
              <Box sx={{ width: '100%' }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 8 }}>
                  Meet our Team
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                  {[
                    { name: 'Viswanadh Akella', role: 'Chief Executive Officer', desc: '15+ years in IT & blockchain. Designs enterprise solutions.', color: '#8B5CF6' },
                    { name: 'Gokul.A', role: 'Chief Technology Officer', desc: 'Blockchain & digital innovation expert. Builds Innovation Labs.', color: '#10B981' },
                    { name: 'Jay.S', role: 'Chief Operating Officer', desc: 'Blockchain & fintech expert. Founded innovative blockchain companies.', color: '#F59E0B' },
                    { name: 'Marc Robinson', role: 'Chief Marketing Officer', desc: '20+ years across digital assets and APAC markets (ex-Head of Coinbase APAC).', color: '#EC4899' },
                    { name: 'JP Dumas', role: 'Strategic Advisor', desc: 'Advisor for NFT & Web3 connectivity. Business expansion in Europe.', color: '#3B82F6' },
                    { name: 'Vivek Thapar', role: 'Strategic Advisor', desc: 'Strategic Advisor for Global Marketing.', color: '#6366F1' },
                  ].map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 4,
                        height: '100%',
                        transition: 'all 0.3s',
                        background: 'rgba(30, 41, 59, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.05)',
                          transform: 'scale(1.02)'
                        }
                      }}>
                        <Avatar sx={{
                          width: 100,
                          height: 100,
                          mb: 3,
                          bgcolor: member.color,
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          boxShadow: '0 0 20px rgba(0,0,0,0.3)'
                        }}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>{member.name}</Typography>
                          <Typography variant="subtitle2" color="primary.light" gutterBottom sx={{ fontWeight: 600 }}>
                            {member.role}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                            {member.desc}
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
