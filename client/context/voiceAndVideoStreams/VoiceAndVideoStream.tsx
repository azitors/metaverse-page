import React, { useRef, useEffect, useState, useContext } from 'react';
import { FunctionComponent } from 'react';
import { RoomStream } from 'skyway-js';

interface Props {
  selectedOutputDeviceId: string;
  stream: RoomStream;
}

export const VoiceAndVideoStream: FunctionComponent<Props> = ({
  stream,
  selectedOutputDeviceId,
}) => {
  const isNoAudio = stream.getAudioTracks().length === 0;
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const $audio = audioRef.current;
    if (isNoAudio || $audio === null) return;
    $audio.srcObject !== stream && ($audio.srcObject = stream);
    $audio.paused && $audio.play();
    if (selectedOutputDeviceId) $audio.setSinkId(selectedOutputDeviceId);
  }, [isNoAudio, audioRef, stream]);

  return (
    <>
      <audio className="remote-stream" ref={audioRef} />
    </>
  );
};
