import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';

export const UnityDisplay: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallet, connected } = useWallet();
    const [account, setAccount] = useState(null);

    const { unityProvider } = useUnityContext({
        loaderUrl: 'unity/build.loader.js',
        dataUrl: 'unity/build.data',
        frameworkUrl: 'unity/build.framework.js',
        codeUrl: 'unity/build.wasm',
    });

    if (connected) {
        console.log(publicKey?.toString());
    }

    return <>{connected && <Unity unityProvider={unityProvider} />}</>;
};
