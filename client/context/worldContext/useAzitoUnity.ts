import { useUnityContext } from 'react-unity-webgl';
import { ClientToUnity, UnityToClient } from '../../../shared/types/UnityCommunications';
import { VoiceAndVideoContext } from '../voiceAndVideoContext/VoiceAndVideoContext';
import { useEffect, useContext } from 'react';

export const useAzitoUnity = () => {
  const {
    userDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    userOutputDevices,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
    toggleMute,
    setRoomId,
    setUserVolume,
  } = useContext(VoiceAndVideoContext);
  const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } =
    useUnityContext({
      loaderUrl: 'unity/Unity.loader.js',
      dataUrl: 'unity/Unity.data',
      frameworkUrl: 'unity/Unity.framework.js',
      codeUrl: 'unity/Unity.wasm',
    });

  const sendToUnity = (data: ClientToUnity) => {
    try {
      console.log(data);
      sendMessage('WebController', 'OnReceive', JSON.stringify(data));
    } catch {
      console.error('sendToUnity Error');
    }
  };

  const sendUserDevices = (): void => {
    const devicesHash: { [key: string]: string }[] = userDevices.map((d) => {
      return { [d.deviceId]: d.label };
    });
    sendToUnity({ type: 'SET_USER_DEVICES', devices: devicesHash, selectedDeviceId });
  };

  const sendUserOutputDevices = (): void => {
    const devicesHash = userOutputDevices.map((d) => {
      return { [d.deviceId]: d.label };
    });
    sendToUnity({ type: 'SET_USER_OUTPUT_DEVICES', devices: devicesHash, selectedOutputDeviceId });
  };

  const handleUnityData = (json: string) => {
    const data = JSON.parse(json) as UnityToClient;
    switch (data.type) {
      case 'TOGGLE_MUTE':
        toggleMute();
        break;
      case 'FETCH_USER_DEVICES':
        sendUserDevices();
        break;
      case 'FETCH_USER_OUTPUT_DEVICES':
        sendUserOutputDevices();
        break;
      case 'SET_DEVICE_ID':
        setSelectedDeviceId(data.deviceId);
        break;
      case 'SET_OUTPUT_DEVICE_ID':
        setSelectedOutputDeviceId(data.outputDeviceId);
        break;
      case 'SET_USER_VOLUME':
        setUserVolume(data.peerId, data.volume);
        break;
      case 'SET_ROOM_ID':
        setRoomId(data.roomId);
        break;
      default:
    }
  };

  useEffect(() => {
    addEventListener('Data', handleUnityData);
    return () => {
      removeEventListener('Data', handleUnityData);
    };
  }, [addEventListener, removeEventListener, handleUnityData]);

  return {
    unityProvider,
    sendToUnity,
    addEventListener,
    removeEventListener,
    isLoaded,
    sendUserDevices,
    sendUserOutputDevices,
  };
};
