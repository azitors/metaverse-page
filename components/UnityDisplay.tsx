import { useWallet } from '@solana/wallet-adapter-react';
import React, { FC } from 'react';
import { Unity } from 'react-unity-webgl';
import { IUnityProvider } from 'react-unity-webgl/distribution/interfaces/unity-provider';

type Props = { unityProvider: IUnityProvider };

export const UnityDisplay: FC<Props> = ({ unityProvider }) => {
  const { publicKey, sendTransaction, wallet, connected } = useWallet();

  if (connected) {
    console.log(publicKey?.toString());
  }

  return <>{connected && <Unity unityProvider={unityProvider} style={{ width: '100%' }} />}</>;
};
