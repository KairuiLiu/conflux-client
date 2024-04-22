import useGlobalStore from '@/context/global-context';
import { refreshMediaDevice } from '@/utils/media-devices';
import { setStreamWithId, stopStream } from '@/utils/media-stream';
import { useEffect } from 'react';

const useMediaStream = (
  selectedDeviceLabel: string,
  setSelectedDeviceLabel: (prevState: string) => void,
  enableStream: boolean,
  setEnableStream: (prevState: boolean) => void,
  stream: MediaStream | null,
  setStream: (stream: MediaStream | null) => void,
  mediaType: 'video' | 'audio',
  deviceKey: 'camera' | 'microphone'
): void => {
  const state = useGlobalStore((d) => d);
  const setState = useGlobalStore.setState;

  useEffect(() => {
    refreshMediaDevice(mediaType, setState);
  });

  useEffect(() => {
    if (!enableStream) {
      stopStream(stream);
      setStream(null);
      return;
    }

    // try to find the given device
    const device = state.mediaDiveces[deviceKey].find(
      (d) => d.label === selectedDeviceLabel
    );

    if (device) {
      setStreamWithId(stream, setStream, device.deviceId, mediaType).then(
        (d) => !d && setEnableStream(false)
      );
    } else if (state.mediaDiveces[deviceKey]?.[0]) {
      setSelectedDeviceLabel(state.mediaDiveces[deviceKey][0].label);
    } else {
      stopStream(stream);
      setStream(null);
    }

    return () => {
      stopStream(stream);
    };
  }, [state.mediaDiveces[deviceKey], selectedDeviceLabel, enableStream]);

  useEffect(() => {
    return () => {
      stopStream(stream);
    };
  }, [stream]);
};

export default useMediaStream;
