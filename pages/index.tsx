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
import { useAzitoUnity } from '../client/context/worldContext/useAzitoUnity';
import { UnityDisplay } from '../components/UnityDisplay';
import Peer, { RoomStream, SfuRoom } from 'skyway-js';
import { useEffect, useState } from 'react';
import {
  initPeer,
  getLocalAudioTrackFromDeviceId,
} from '../client/context/voiceAndVideoContext/libraries';
import { VoiceAndVideoStream } from '../client/context/voiceAndVideoStreams/VoiceAndVideoStream';

const Home: NextPage = () => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const [peer, setPeer] = useState<Peer>(null);
  const [peerId, setPeerId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [isMute, setIsMute] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack>(null);
  const [voiceChatRoom, setVoiceChatRoom] = useState<SfuRoom>(null);
  const [remoteStreams, setRemoteStreams] = useState<RoomStream[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedOutputDeviceId, setSelectedOutputDeviceId] = useState<string>('');

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  const { unityProvider, sendMessage, addEventListener, removeEventListener } = useAzitoUnity();

  const handleToggleMute = useCallback(() => {
    console.log('ToggleMute');
    if (localAudioTrack) {
      localAudioTrack.enabled = isMute;
    }
    setIsMute((currentIsMute) => !currentIsMute);
  }, []);

  useEffect(() => {
    if (peer) {
      setPeerId(peer.id);
    }
    if (voiceChatRoom) {
      setRoomId(voiceChatRoom.name);
    }
  }, [peer, voiceChatRoom]);

  const getUserDevices = async () => {
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
  };

  useEffect(() => {
    setLocalStream(new MediaStream());
    getUserDevices();
    addEventListener('ToggleMute', handleToggleMute);
  }, []);

  const accessPeer = async () => {
    peer && peer.destroy();
    setRemoteStreams((_) => []);
    const newPeer = await initPeer(`sample_user_${Date.now()}`, false);
    newPeer.once('error', (error) => {
      console.log('peer error', error);
    });
    setPeer(newPeer);
    const sfuRoom = newPeer.joinRoom<SfuRoom>('sample_room_sfu', {
      mode: 'sfu',
      stream: localStream,
      videoReceiveEnabled: true,
    });
    setVoiceChatRoom(sfuRoom);
    sfuRoom.on('stream', (stream) => {
      console.log('ON_STREAM:' + stream.peerId);
      setRemoteStreams((streams) => [...streams, stream]);
    });
    sfuRoom.on('peerLeave', (peerId) => {
      console.log('ON_LEAVE:' + peerId);
      setRemoteStreams((streams) => streams.filter((s) => s.peerId !== peerId));
    });
    sfuRoom.on('error', (error) => {
      console.log('sfu room ERROR:' + error);
    });
    const track = await getLocalAudioTrackFromDeviceId(selectedDeviceId);
    setLocalAudioTrack(track);
    localStream.addTrack(track);
    track.enabled = !isMute;
  };

  return (
    <>
      <Head>
        <title>AZITO</title>
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletMultiButton />
            <button onClick={accessPeer}>Access Voice Chat</button>
            <p>Mute: {isMute ? <>On</> : <>Off</>}</p>
            <p>currentUser: {peerId}</p>
            <p>roomId: {roomId}</p>
            <p>
              <span>roomUsers: [</span>
              {remoteStreams.map((stream) => (
                <span key={stream.id}>{stream.peerId}, </span>
              ))}
              <span>]</span>
            </p>
            <UnityDisplay unityProvider={unityProvider} />
            {remoteStreams.map((stream) => (
              <VoiceAndVideoStream
                stream={stream}
                key={stream.peerId}
                selectedOutputDeviceId={selectedOutputDeviceId}
              />
            ))}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

export default Home;
