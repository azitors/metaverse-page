import { useEffect, useState } from 'react';

export const useVoiceChatDevice = () => {
  const [haveDeviceAccess, setHaveDeviceAccess] = useState(true);
  const [userDevices, setUserDevices] = useState<MediaDeviceInfo[]>([]);
  const [userOutputDevices, setUserOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => {
    return localStorage.getItem('selectedDeviceId') || '';
  });
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState<string>(() => {
    let val = localStorage.getItem('selectedOutputDeviceId');
    return val || '';
  });

  useEffect(() => {
    console.log('initializeLocalStream');
    checkDeviceAccess();
  }, []);

  useEffect(() => {
    if (!haveDeviceAccess) return;
    getUserDevices();
  }, [haveDeviceAccess]);

  const checkDeviceAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHaveDeviceAccess(true);
    } catch {
      setHaveDeviceAccess(false);
    }
  };
  const getUserDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter(
        (device) => device.kind === 'audioinput' && device.deviceId !== 'communications'
      );
      const audioOutputDevices = devices.filter(
        (device) => device.kind === 'audiooutput' && device.deviceId !== 'communications'
      );
      if (
        selectedDeviceId === '' ||
        !audioInputDevices.some((device) => device.deviceId === selectedDeviceId)
      ) {
        setSelectedDeviceId(audioInputDevices[0].deviceId);
      } else {
        setSelectedDeviceId(selectedDeviceId);
      }
      if (
        selectedOutputDeviceId === '' ||
        !audioOutputDevices.some((device) => device.deviceId === selectedOutputDeviceId)
      ) {
        setSelectedOutputDeviceId(audioOutputDevices[0].deviceId);
      } else {
        setSelectedOutputDeviceId(selectedOutputDeviceId);
      }
      localStorage.setItem('selectedOutputDeviceId', selectedOutputDeviceId);
      setUserDevices(audioInputDevices);
      setUserOutputDevices(audioOutputDevices);
    } catch (error) {
      setHaveDeviceAccess(false);
    }
  };
  navigator.mediaDevices.ondevicechange = () => {
    checkDeviceAccess();
  };
  return {
    haveDeviceAccess,
    userDevices,
    userOutputDevices,
    selectedDeviceId,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
    setSelectedDeviceId,
  };
};
