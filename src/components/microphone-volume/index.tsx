import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../progress';

const MicrophoneVolume: React.FC<{
  stream: MediaStream | null;
}> = ({ stream }) => {
  const [volume, setVolume] = useState(0);
  const maxVolume = useRef(1e-6);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!stream) return;
    maxVolume.current = 1e-6;
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(
      stream!
    );
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);

    const pcmData = new Float32Array(analyserNode.fftSize);
    const onFrame = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) {
        sumSquares += amplitude * amplitude;
      }
      const realVoume = Math.sqrt(sumSquares / pcmData.length);
      if (realVoume > maxVolume.current) {
        maxVolume.current = realVoume;
        setVolume(1);
      } else {
        const preVolume = realVoume / maxVolume.current;
        setVolume(
          preVolume < 0.001 || maxVolume.current < 0.001 ? 0 : preVolume
        );
      }

      animationFrameRef.current = window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);

    return () => {
      mediaStreamAudioSourceNode.disconnect();
      analyserNode.disconnect();
      cancelAnimationFrame(animationFrameRef.current!);
    };
  }, [stream]);

  return <ProgressBar progress={volume} />;
};

export default MicrophoneVolume;
