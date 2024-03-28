import { Context } from '@/context';
import { refreshMediaDevice } from '@/utils/media-devices';
import { setStreamWithId, stopStream } from '@/utils/media-stream';
import { useContext, useEffect, useState } from 'react';

const useMediaStream = (
  defauleMediaLabel: string,
  mediaType: 'video' | 'audio',
  deviceKey: 'camera' | 'microphone',
  defaultEnableStream: boolean = true
): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
  MediaStream | null,
  enableStream: boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const { state, setState } = useContext(Context);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [enableStream, setEnableStream] = useState(defaultEnableStream);
  const [selectedDeviceLabel, setSelectedDeviceLabel] =
    useState(defauleMediaLabel);

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

  return [
    selectedDeviceLabel,
    setSelectedDeviceLabel,
    stream,
    enableStream,
    setEnableStream,
  ];
};

export default useMediaStream;
