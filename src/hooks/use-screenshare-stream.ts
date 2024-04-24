import React, { useState, useEffect } from 'react';
import { stopStream } from '../utils/media-stream';

const useScreenshareStream = (
  enableShare: boolean,
  setEnableShare: (enableShare: boolean) => void,
  stream: MediaStream | null,
  setStream: (stream: MediaStream | null) => void
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [enableAudio, setEnableAudio] = useState(false);

  useEffect(() => {
    if (!enableShare) {
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
            setEnableShare(false);
            setEnableAudio(false);
          };
        });
      })
      .catch(() => {
        setEnableShare(false);
        setEnableAudio(false);
      });

    return () => {
      if (!enableShare) {
        stopStream(stream);
        setStream(null);
        setEnableAudio(false);
      } else {
        stopStream(stream);
        setStream(null);
      }
    };
  }, [enableShare, enableAudio]);

  useEffect(() => {
    if (!enableShare && stream) stopStream(stream);
  }, [enableShare, enableAudio, stream]);

  useEffect(() => {
    return () => {
      stopStream(stream);
    };
  }, [stream]);

  return [enableAudio, setEnableAudio];
};

export default useScreenshareStream;
