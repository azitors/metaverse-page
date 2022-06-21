import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import logo from './logo.svg';
import './App.css';

import '@solana/wallet-adapter-react-ui/styles.css';
import { UnityDisplay } from './UnityDisplay';
import { Theme } from './Theme';

function App() {
    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

    return (
        <Theme>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <AppBar position="static">
                            <Container maxWidth="xl">
                                <Toolbar disableGutters>
                                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                        AZITO
                                    </Typography>

                                    <WalletMultiButton />
                                </Toolbar>
                            </Container>
                        </AppBar>
                        <Box display="flex" pt="4em" alignItems="center" justifyContent="center">
                            <UnityDisplay />
                        </Box>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </Theme>
    );
}

export default App;
