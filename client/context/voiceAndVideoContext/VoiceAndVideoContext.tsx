import { createContext, Dispatch, FunctionComponent, SetStateAction, useContext } from 'react';
import { RoomStream } from 'skyway-js';
import { WorldContext } from '../worldContext/WorldContext';
import { useVoiceAndVideoChat } from './useVoiceAndVideoChat';
import { useSelector } from 'react-redux';
import RootState from '../../store/rootState';

export type VoiceAndVideoContextValue = {
  audioContext: AudioContext;
  haveDeviceAccess: boolean;
  isMute: boolean;
  remoteStreams: RoomStream[];
  toggleMute: () => void;
  userDevices: MediaDeviceInfo[];
  userOutputDevices: MediaDeviceInfo[];
  selectedDeviceId: string;
  selectedOutputDeviceId: string;
  setSelectedDeviceId: Dispatch<SetStateAction<string>>;
  setSelectedOutputDeviceId: Dispatch<SetStateAction<string>>;
};

interface Props {
  children: React.ReactNode;
}

export const VoiceAndVideoContext = createContext({} as VoiceAndVideoContextValue);
export const VoiceAndVideoContextProvider: FunctionComponent<Props> = ({ children }) => {
  const contextValue = useVoiceAndVideoChat();

  return (
    <VoiceAndVideoContext.Provider value={{ ...contextValue }}>
      {children}
    </VoiceAndVideoContext.Provider>
  );
};
