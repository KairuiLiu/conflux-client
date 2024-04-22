import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../progress';

const SpeakerVolume: React.FC<{
  element?: HTMLAudioElement;
  relitive?: boolean;
}> = ({ element, relitive = false }) => {
  const [volume, setVolume] = useState(0);
  // fucking react re-render on dev mode
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const mediaStreamAudioSourceNodeRef = useRef<MediaElementAudioSourceNode>();
  const analyserNodeRef = useRef<AnalyserNode>();
  const linked = useRef(false);
  const maxVolumeRef = useRef(0);

  useEffect(() => {
    if (!element || linked.current) return;
    maxVolumeRef.current = 0;
    linked.current = true;
    audioContextRef.current = new AudioContext();
    mediaStreamAudioSourceNodeRef.current =
      audioContextRef.current.createMediaElementSource(element);
    analyserNodeRef.current = audioContextRef.current.createAnalyser();
    mediaStreamAudioSourceNodeRef.current.connect(analyserNodeRef.current);
    const dataArray = new Uint8Array(analyserNodeRef.current.frequencyBinCount);

    const onFrame = () => {
      if (analyserNodeRef.current) {
        analyserNodeRef.current.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += (dataArray[i] - 128) * (dataArray[i] - 128);
        }
        const realVolume = Math.sqrt(sum / dataArray.length) / 255;
        maxVolumeRef.current = Math.max(maxVolumeRef.current, realVolume);
        if (relitive) setVolume(realVolume / maxVolumeRef.current);
        else setVolume(realVolume);
      }
      animationFrameRef.current = window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);

    return () => {
      mediaStreamAudioSourceNodeRef.current?.disconnect?.();
      analyserNodeRef.current?.disconnect?.();
      cancelAnimationFrame(animationFrameRef.current!);
      linked.current = false;
      setVolume(0);
    };
  }, [element]);

  return <ProgressBar progress={volume} />;
};

export default SpeakerVolume;
