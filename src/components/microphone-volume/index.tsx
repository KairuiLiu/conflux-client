import React, { useEffect, useRef, useState } from 'react';
import ProgressBar from '../progress';

const MicrophoneVolume: React.FC<{
  stream: MediaStream | null;
}> = ({ stream }) => {
  const [volume, setVolume] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!stream) return;
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
      setVolume(Math.sqrt(sumSquares / pcmData.length));
      animationFrameRef.current = window.requestAnimationFrame(onFrame);
    };
    window.requestAnimationFrame(onFrame);

    return () => {
      mediaStreamAudioSourceNode.disconnect();
      analyserNode.disconnect();
      cancelAnimationFrame(animationFrameRef.current!);
    };
  }, [stream]);

  return <ProgressBar progress={volume} text/>;
};

export default MicrophoneVolume;
