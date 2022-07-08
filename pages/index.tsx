import type { NextPage } from 'next';
import React, { useMemo, useCallback } from 'react';
import Head from 'next/head';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { UnityDisplay } from '../components/UnityDisplay';
import { VoiceAndVideoContextProvider } from '../client/context/voiceAndVideoContext/VoiceAndVideoContext';
import { WorldContextProvider } from '../client/context/worldContext/WorldContext';

const Home: NextPage = () => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  return (
    <>
      <Head>
        <title>AZITO</title>
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WorldContextProvider>
              <VoiceAndVideoContextProvider>
                <UnityDisplay />
              </VoiceAndVideoContextProvider>
            </WorldContextProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

export default Home;
