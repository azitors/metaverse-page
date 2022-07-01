import Peer from 'skyway-js';

export const initPeer = (id: string, forceTurn: boolean): Promise<Peer> => {
  return new Promise((resolve, reject) => {
    const peer = new Peer(id, {
      key: process.env.NEXT_PUBLIC_SKYWAY_API_KEY,
      debug: 2,
      config: {
        iceTransportPolicy: forceTurn ? 'relay' : 'all',
      },
    });

    peer.once('open', () => {
      peer.removeListener('error', reject);
      resolve(peer);
    });
    // for onOpen error
    peer.once('error', reject);
  });
};

export const getLocalAudioTrackFromDeviceId = async (
  deviceId: string
): Promise<MediaStreamTrack> => {
  const constraints = deviceId === '' ? true : { deviceId: { exact: deviceId } };
  return navigator.mediaDevices
    .getUserMedia({ audio: constraints })
    .then((stream) => stream.getAudioTracks()[0]);
};
