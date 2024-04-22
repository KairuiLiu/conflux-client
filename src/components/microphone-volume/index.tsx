import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../progress';

const MicrophoneVolume: React.FC<{
  stream: MediaStream | null;
  relativeVolume?: boolean;
}> = ({ stream, relativeVolume }) => {
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

      if (relativeVolume) {
        let sumAbs = 0.0;
        for (const amplitude of pcmData) sumAbs += Math.abs(amplitude);
        if (sumAbs > maxVolume.current) {
          maxVolume.current = sumAbs;
          setVolume(1);
        } else {
          const relativeVolume = sumAbs / maxVolume.current;
          setVolume(maxVolume.current < 1 ? 0 : relativeVolume);
        }
      } else {
        let sumSquares = 0.0;
        for (const amplitude of pcmData) {
          sumSquares += amplitude * amplitude;
        }
        const realVoume = Math.sqrt(sumSquares / pcmData.length);
        setVolume(realVoume);
      }
      animationFrameRef.current = window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);

    return () => {
      mediaStreamAudioSourceNode.disconnect();
      analyserNode.disconnect();
      cancelAnimationFrame(animationFrameRef.current!);
    };
  }, [stream, relativeVolume]);

  return <ProgressBar progress={volume} />;
};

export default MicrophoneVolume;
