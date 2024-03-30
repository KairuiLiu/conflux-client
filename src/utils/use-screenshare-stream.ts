import React, { useState, useEffect } from 'react';
import { stopStream } from './media-stream';

const useScreenshareStream = (): [
  MediaStream | null,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [enableStream, setEnableStream] = useState(false);
  const [enableAudio, setEnableAudio] = useState(false);

  useEffect(() => {
    if (!enableStream) {
      stopStream(stream);
      setStream(null);
      setEnableAudio(false);
      return;
    }

    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: enableAudio,
      })
      .then((newStream) => {
        setStream(newStream);

        newStream.getTracks().forEach((track) => {
          track.onended = () => {
            stopStream(newStream);
            setStream(null);
            setEnableStream(false);
            setEnableAudio(false);
          };
        });
      })
      .catch((error) => {
        console.error('Error getting screen sharing stream:', error);
        setEnableStream(false);
        setEnableAudio(false);
      });

    return () => {
      stopStream(stream);
      setStream(null);
      setEnableAudio(false);
    };
  }, [enableStream, enableAudio]);

  useEffect(() => {
    return () => {
      stopStream(stream);
    };
  }, [stream]);

  return [stream, enableStream, setEnableStream, enableAudio, setEnableAudio];
};

export default useScreenshareStream;
