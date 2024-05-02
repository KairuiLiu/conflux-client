import useGlobalStore from '@/context/global-context';
import useMeetingStore from '@/context/meeting-context';
import { useEffect, useMemo, useState } from 'react';

function useAudioStreamPlayer() {
  const meetingContext = useMeetingStore((d) => d);
  const mediaDiveces = useGlobalStore((s) => s.mediaDiveces);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const audioElement = useMemo(() => new Audio(), []);

  useEffect(() => {
    if (audioStream && meetingContext.meetingDeviceState.enableSpeaker) {
      const speaker = mediaDiveces.speaker.find(
        (d) => d.label === meetingContext.meetingDeviceState.speakerLabel
      );

      Promise.resolve()
        .then(() => {
          console.log('[Media] start play audio', audioStream, speaker);
          if (speaker?.deviceId) {
            // @ts-ignore
            audioElement?.setSinkId?.(speaker.deviceId);
          }
        })
        .then(() => {
          audioElement.srcObject = audioStream;
          audioElement.play().catch((e) => console.error('Failed to play:', e));
        });
    }

    return () => {
      audioElement.pause();
      audioElement.srcObject = null;
    };
  }, [
    audioStream,
    meetingContext.meetingDeviceState.enableSpeaker,
    audioElement,
  ]);

  useEffect(() => {
    const speaker = mediaDiveces.speaker.find(
      (d) => d.label === meetingContext.meetingDeviceState.speakerLabel
    );

    // @ts-ignore
    if (speaker?.deviceId && audioElement.setSinkId) {
      audioElement
        // @ts-ignore
        .setSinkId(speaker.deviceId)
        .then(() => {
          if (!audioElement.paused) {
            audioElement.pause();
            audioElement.srcObject = audioStream;
            audioElement
              .play()
              .catch((e) => console.error('Failed to restart audio:', e));
          }
        })
        .catch((e: unknown) => console.error('Failed to set device:', e));
    }
  }, [
    mediaDiveces.speaker,
    meetingContext.meetingDeviceState.speakerLabel,
    audioElement,
    audioStream,
  ]);

  return setAudioStream;
}

export default useAudioStreamPlayer;
