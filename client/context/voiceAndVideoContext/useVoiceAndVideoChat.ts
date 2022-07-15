import { useContext, useEffect, useState } from 'react';
import { RoomStream, SfuRoom } from 'skyway-js';
import { useSkywayPeer } from './useSkywayPeer';
import { getLocalAudioTrackFromDeviceId } from './libraries';
import { useVoiceChatDevice } from './useVoiceChatDevice';
import { WorldContext } from '../worldContext/WorldContext';
import { UserState } from '../../../shared/types/UserState';

export interface HTMLMediaElementWithSetSinkId extends HTMLMediaElement {
  setSinkId(id: string);
}

export const useVoiceAndVideoChat = () => {
  const {
    haveDeviceAccess,
    userDevices,
    userOutputDevices,
    selectedDeviceId,
    selectedOutputDeviceId,
    setSelectedOutputDeviceId,
    setSelectedDeviceId,
  } = useVoiceChatDevice();
  const [audioContext] = useState(new AudioContext());
  const [isMute, setIsMute] = useState(true);
  const [localStream] = useState<MediaStream>(new MediaStream());
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream>(new MediaStream());
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack>(null);
  const [roomId, setRoomId] = useState<string>('Overworld');
  const [voiceChatRoom, setVoiceChatRoom] = useState<SfuRoom>(null);
  const [videoStreamRoom, setVideoStreamRoom] = useState<SfuRoom>(null);
  const [remoteStreams, setRemoteStreams] = useState<RoomStream[]>([]);
  const { userList, setUserList } = useContext(WorldContext);
  const numberOfUserInCurrentArea = userList.length;
  const voicePeer = useSkywayPeer('VOICE');
  const numberOfScreenInRemote = remoteStreams.filter(
    (stream) => stream.getVideoTracks().length !== 0
  ).length;

  useEffect(() => {
    if (selectedDeviceId !== '') {
      setLocalStreamFromSelectedDevice();
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    if (selectedOutputDeviceId !== '') {
      const remoteStreamElements =
        document.querySelectorAll<HTMLMediaElementWithSetSinkId>('.remote-stream');
      remoteStreamElements.forEach((elm) => {
        elm.setSinkId(selectedOutputDeviceId);
      });
    }
  }, [selectedOutputDeviceId]);

  useEffect(() => {
    if (voicePeer == null || localAudioTrack == null) return;
    if (voiceChatRoom !== null && voiceChatRoom.name !== roomId) {
      closeVoiceChatRoom();
    }
    if (voiceChatRoom === null) {
      joinVoiceChatRoom();
    }
  }, [voicePeer, localAudioTrack, voiceChatRoom, roomId]);
  const setLocalStreamFromSelectedDevice = async () => {
    if (localAudioTrack !== null) {
      localStream.removeTrack(localAudioTrack);
    }
    const track = await getLocalAudioTrackFromDeviceId(selectedDeviceId);
    if (!track) return;
    setLocalAudioTrack(track);
    localStream.addTrack(track);
    track.enabled = !isMute;
    localStorage.setItem('selectedDeviceId', selectedDeviceId);
  };

  const joinVoiceChatRoom = () => {
    console.log(`JOIN ROOM: ${roomId}`);
    const sfuRoom = voicePeer.joinRoom<SfuRoom>(roomId, {
      mode: 'sfu',
      stream: localStream,
      videoReceiveEnabled: true,
    });
    setVoiceChatRoom(sfuRoom);
    sfuRoom.on('stream', (stream) => {
      console.log('ON_STREAM:' + stream.peerId);
      setRemoteStreams((streams) => [...streams, stream]);
      const user: UserState = { peerId: stream.peerId, volume: 0.5 } as UserState;
      setUserList((userList) => [...userList, user]);
    });
    sfuRoom.on('peerLeave', (peerId) => {
      console.log('ON_LEAVE' + peerId.split('_')[0]);
      setRemoteStreams((streams) => streams.filter((s) => s.peerId !== peerId));
      setUserList((userList) => userList.filter((u) => u.peerId !== peerId));
    });
    sfuRoom.on('error', (error) => {
      console.error(error);
    });
  };

  const closeVoiceChatRoom = () => {
    console.log(`CLOSE ROOM: ${voiceChatRoom.name}`);
    setVoiceChatRoom((room) => {
      room.close();
      return null;
    });
    setRemoteStreams((_) => []);
    setUserList((_) => []);
  };

  const toggleMute = () => {
    localAudioTrack.enabled = isMute;
    setIsMute(!isMute);
  };

  const setUserVolume = (peerId: string, volume: number) => {
    const targetUser = userList.find((u) => u.peerId === peerId);
    targetUser.volume = volume;
    setUserList((userList) => [...userList.filter((u) => u.peerId !== peerId), targetUser]);
    const element: HTMLMediaElement = document.querySelector(`[data-audio-id="${peerId}"]`);
    element.volume = volume;
  };

  return {
    audioContext,
    haveDeviceAccess,
    isMute,
    remoteStreams,
    toggleMute,
    userDevices,
    userOutputDevices,
    selectedDeviceId,
    selectedOutputDeviceId,
    setSelectedDeviceId,
    setSelectedOutputDeviceId,
    voiceChatRoom,
    setRoomId,
    setUserVolume,
  };
};
