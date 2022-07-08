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

export const UnityDisplay: FC = () => {
  const { publicKey, sendTransaction, wallet, connected } = useWallet();
  const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } =
    useAzitoUnity();
  const { userList, setUserList } = useContext(WorldContext);

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
  } = useContext(VoiceAndVideoContext);

  const sendUserDevices = (): void => {
    const data = JSON.stringify(
      userDevices.map((d) => {
        return { [d.deviceId]: d.label };
      })
    );
    console.log(data);
    sendMessage('setDvices', data);
  };

  useEffect(() => {
    if (isLoaded) {
      sendUserDevices();
    }
  }, [userDevices]);

  useEffect(() => {
    addEventListener('FetchDevices', sendUserDevices);
    return () => {
      removeEventListener('FetchDevices', sendUserDevices);
    };
  }, [addEventListener, removeEventListener, sendUserDevices]);

  useEffect(() => {
    addEventListener('SetDeviceId', setSelectedDeviceId);
    return () => {
      removeEventListener('SetDeviceId', setSelectedDeviceId);
    };
  }, [addEventListener, removeEventListener, setSelectedDeviceId]);

  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  const sendUserOutputDevices = (): void => {
    const data = JSON.stringify(
      userOutputDevices.map((d) => {
        return { [d.deviceId]: d.label };
      })
    );
    console.log(data);
    sendMessage('setOutputDvices', data);
  };

  useEffect(() => {
    addEventListener('FetchOutputDevices', sendUserOutputDevices);
    return () => {
      removeEventListener('FetchOutputDevices', sendUserOutputDevices);
    };
  }, [addEventListener, removeEventListener, sendUserOutputDevices]);

  useEffect(() => {
    if (isLoaded) {
      sendUserOutputDevices;
    }
  }, [userOutputDevices]);

  useEffect(() => {
    addEventListener('SetOutputDeviceId', setSelectedOutputDeviceId);
    return () => {
      removeEventListener('SetOutputDeviceId', setSelectedOutputDeviceId);
    };
  }, [addEventListener, removeEventListener, setSelectedOutputDeviceId]);

  const handleOutputDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOutputDeviceId(e.target.value);
  };

  useEffect(() => {
    addEventListener('ToggleMute', toggleMute);
    return () => {
      removeEventListener('ToggleMute', toggleMute);
    };
  }, [addEventListener, removeEventListener, toggleMute]);

  const handleClick = () => {
    toggleMute();
  };

  const handleUserVolume = (peerId: string, volume: number) => {
    const targetUser = userList.find((u) => u.peerId === peerId);
    targetUser.volume = volume;
    setUserList((userList) => [...userList.filter((u) => u.peerId !== peerId), targetUser]);
    const element: HTMLMediaElement = document.querySelector(`[data-audio-id="${peerId}"]`);
    element.volume = volume;
  };

  useEffect(() => {
    if (isLoaded) {
      const data = JSON.stringify(userList);
      console.log(data);
      sendMessage('setUserList', data);
    }
  }, [userList]);

  useEffect(() => {
    addEventListener('SetUserVolume', handleUserVolume);
    return () => {
      removeEventListener('SetUserVolume', handleUserVolume);
    };
  }, [addEventListener, removeEventListener, handleUserVolume]);

  return (
    <>
      <div>
        Mute: {isMute ? <>On</> : <>Off</>}
        <button onClick={handleClick}>MuteToggle</button>
      </div>

      <div>
        <select value={selectedDeviceId} onChange={handleDeviceChange}>
          {userDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <button onClick={sendUserDevices}>SendUserDevices</button>
      </div>

      <div>
        <select value={selectedOutputDeviceId} onChange={handleOutputDeviceChange}>
          {userOutputDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <button onClick={sendUserOutputDevices}>SendUserOutputDevices</button>
      </div>

      <div>
        roomUsers:
        {userList.map((user) => (
          <div key={user.peerId}>
            {user.peerId}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={user.volume}
              onChange={(e) => handleUserVolume(user.peerId, Number(e.target.value))}
            />
          </div>
        ))}
      </div>
      <>{connected && <Unity unityProvider={unityProvider} style={{ width: '100%' }} />}</>

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
