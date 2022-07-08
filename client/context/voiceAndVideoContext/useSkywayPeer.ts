import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Peer from 'skyway-js';
import RootState from '../../store/rootState';
import { initPeer } from './libraries';

export const useSkywayPeer = (usage: 'VOICE' | 'VIDEO') => {
  const [peer, setPeer] = useState<Peer>(null);
  const userId = useSelector<RootState, string>((state) => state.user.address);
  useEffect(() => {
    peer && peer.destroy();
    console.log(userId);
    if (userId) {
      initializePeer();
    }
  }, [userId]);
  const initializePeer = async () => {
    try {
      const peer = await initPeer(`${userId}_${usage}`, false);
      peer.once('error', (error) => {
        console.error(error);
      });
      setPeer(peer);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    return () => peer && peer.destroy();
  }, []);
  return peer;
};
