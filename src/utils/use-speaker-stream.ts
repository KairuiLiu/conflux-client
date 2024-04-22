import useGlobalStore from '@/context/global-context';
import { refreshMediaDevice } from '@/utils/media-devices';
import { useEffect, useState } from 'react';
import testSound from '@/assets/Bluestone_Alley_clip.mp3';
import testSoundFull from '@/assets/Bluestone_Alley.mp3';
import { toast } from 'react-toastify';
import toastConfig from './toast-config';

const useSpeakerStream = (
  speakerLabel: string,
  setSpeakerLabel: (speakerLabel: string) => void
): [HTMLAudioElement | undefined, (full?: boolean) => void] => {
  const state = useGlobalStore();
  const setState = useGlobalStore.setState;

  const [audioElementAnylist, setAudioElementAnylist] =
    useState<HTMLAudioElement>();
  const [audioElement, setAudioElement] = useState<HTMLAudioElement>();

  useEffect(() => {
    refreshMediaDevice('audio', setState);
  });

  // Shit design: JS audio context API
  const speakerTestCallbackSingle = async (
    oldElem: HTMLAudioElement | undefined,
    setElem: React.Dispatch<React.SetStateAction<HTMLAudioElement | undefined>>,
    full: boolean
  ) => {
    if (oldElem !== undefined) {
      oldElem.pause();
      oldElem.src = '';
      setElem(undefined);
    } else {
      const speaker = state.mediaDiveces.speaker.find(
        (d) => d.label === speakerLabel
      );
      if (speaker) {
        const element = document.createElement('audio');
        if (full) element.src = testSoundFull;
        else element.src = testSound;
        try {
          // @ts-ignore
          await element.setSinkId(speaker.deviceId);
          element.play();
          setElem(element);
        } catch (error) {
          console.info('[ERROR] Audio playback error:', error);
          toast.info('Audio playback error', toastConfig);
        }
      }
    }
  };

  const speakerTestCallback = (full = false) => {
    speakerTestCallbackSingle(audioElement, setAudioElement, full);
    speakerTestCallbackSingle(
      audioElementAnylist,
      setAudioElementAnylist,
      full
    );
  };

  function pauseAllAudioContext() {
    if (audioElementAnylist) {
      audioElementAnylist.pause();
      audioElementAnylist.src = '';
      setAudioElementAnylist(undefined);
    }
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
      setAudioElement(undefined);
    }
  }

  // [INIT & UPDATE] rebind stream when meeting config speaker | device list changed => rebind stream
  useEffect(() => {
    pauseAllAudioContext();

    // try to find the default speaker
    const speaker = state.mediaDiveces.speaker.find(
      (d) => d.label === speakerLabel
    );

    if (speaker) {
      return;
    } else if (state.mediaDiveces.speaker[0]) {
      setSpeakerLabel(state.mediaDiveces.speaker[0].label);
    } else {
      pauseAllAudioContext();
    }

    return () => {
      pauseAllAudioContext();
    };
  }, [state.mediaDiveces.speaker, speakerLabel]);

  useEffect(() => {}, []);

  return [audioElementAnylist, speakerTestCallback];
};

export default useSpeakerStream;
