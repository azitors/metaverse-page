import { useWallet } from '@solana/wallet-adapter-react';
import React, { FC, useContext, useEffect, Dispatch } from 'react';
import { Unity } from 'react-unity-webgl';
import { IUnityProvider } from 'react-unity-webgl/distribution/interfaces/unity-provider';
import { VoiceAndVideoContext } from '../client/context/voiceAndVideoContext/VoiceAndVideoContext';
import { VoiceAndVideoStream } from '../client/context/voiceAndVideoStreams/VoiceAndVideoStream';
import { useAzitoUnity } from '../client/context/worldContext/useAzitoUnity';
import { useDispatch, useSelector } from 'react-redux';
import { UserActions, userSelector } from '../client/store/userModule';
import { WorldContext } from '../client/context/worldContext/WorldContext';
import { UserState } from '../shared/types/UserState';
import { css } from '@emotion/react';

export const UnityDisplay: FC = () => {
  const { publicKey, wallet, connected } = useWallet();
  const {
    unityProvider,
    sendToUnity,
    addEventListener,
    removeEventListener,
    isLoaded,
    sendUserDevices,
    sendUserOutputDevices,
  } = useAzitoUnity();
  const { userList } = useContext(WorldContext);

  const {
    userDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    userOutputDevices,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
    remoteStreams,
    toggleMute,
    isMute,
    voiceChatRoom,
    setRoomId,
    setUserVolume,
  } = useContext(VoiceAndVideoContext);

  useEffect(() => {
    if (isLoaded && connected) {
      sendToUnity({ type: 'SET_WALLET_ADDRESS', publicKey: publicKey.toString() });
    }
  }, [isLoaded, connected, publicKey]);

  useEffect(() => {
    if (isLoaded) {
      sendUserDevices();
    }
  }, [userDevices, isLoaded]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  useEffect(() => {
    if (isLoaded) {
      sendUserOutputDevices();
    }
  }, [userOutputDevices, isLoaded]);

  const handleOutputDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOutputDeviceId(e.target.value);
  };

  const handleClick = () => {
    toggleMute();
  };

  useEffect(() => {
    if (isLoaded) {
      sendToUnity({ type: 'SET_USER_LIST', userList });
    }
  }, [userList, isLoaded]);

  const changeRoom = (roomId: string) => {
    setRoomId(roomId);
  };

  useEffect(() => {
    addEventListener('SetRoomId', changeRoom);
    return () => {
      removeEventListener('SetRoomId', changeRoom);
    };
  }, [addEventListener, removeEventListener, changeRoom]);

  return (
    <>
      <>{connected && <Unity unityProvider={unityProvider} css={unityView} />}</>

      {remoteStreams.map((stream) => {
        return (
          <VoiceAndVideoStream
            stream={stream}
            key={stream.peerId}
            selectedOutputDeviceId={selectedOutputDeviceId}
          />
        );
      })}
    </>
  );
};

const unityView = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
`;
