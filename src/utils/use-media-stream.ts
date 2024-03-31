import useGlobalStore from '@/context/global-context';
import { refreshMediaDevice } from '@/utils/media-devices';
import { setStreamWithId, stopStream } from '@/utils/media-stream';
import { useEffect, useState } from 'react';

const useMediaStream = (
  selectedDeviceLabel: string,
  setSelectedDeviceLabel: (prevState: string) => void,
  enableStream: boolean,
  mediaType: 'video' | 'audio',
  deviceKey: 'camera' | 'microphone'
): [MediaStream | null] => {
  const state = useGlobalStore((d) => d);
  const setState = useGlobalStore.setState;
  const [stream, setStream] = useState<MediaStream | null>(null);

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
      setStreamWithId(stream, setStream, device.deviceId, mediaType);
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

  return [stream];
};

export default useMediaStream;
