import { UserState } from './UserState';
export type ClientToUnity = SetWalletAddress | SetUserDevices | SetUserOutputDevices | SetUserList;

type SetWalletAddress = {
  type: 'SET_WALLET_ADDRESS';
  publicKey: string;
};

type SetUserDevices = {
  type: 'SET_USER_DEVICES';
  devices: { [key: string]: string }[];
  selectedDeviceId: string;
};

type SetUserOutputDevices = {
  type: 'SET_USER_OUTPUT_DEVICES';
  devices: { [key: string]: string }[];
  selectedOutputDeviceId: string;
};

type SetUserList = {
  type: 'SET_USER_LIST';
  userList: UserState[];
};

export type UnityToClient =
  | ToggleMute
  | FetchUserDevices
  | FetchUserOutputDevices
  | SetDeviceId
  | SetOutputDeviceId
  | SetUserVolume
  | SetRoomId;

type ToggleMute = {
  type: 'TOGGLE_MUTE';
};

type FetchUserDevices = {
  type: 'FETCH_USER_DEVICES';
};

type FetchUserOutputDevices = {
  type: 'FETCH_USER_OUTPUT_DEVICES';
};

type SetDeviceId = {
  type: 'SET_DEVICE_ID';
  deviceId: string;
};

type SetOutputDeviceId = {
  type: 'SET_OUTPUT_DEVICE_ID';
  outputDeviceId: string;
};

type SetUserVolume = {
  type: 'SET_USER_VOLUME';
  peerId: string;
  volume: number;
};

type SetRoomId = {
  type: 'SET_ROOM_ID';
  roomId: string;
};
