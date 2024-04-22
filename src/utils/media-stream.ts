// setoutput

import { toast } from 'react-toastify';
import toastConfig from './toast-config';

export async function stopStream(stream: MediaStream | null) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

export async function getStream(type: 'audio' | 'video') {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ [type]: true });
    return stream;
  } catch (error) {
    console.info(`[ERROR] on create ${type} stream `, error);
    toast.error(`Error on get media stream`, toastConfig);
    return false;
  }
}

export async function setStreamWithId(
  stream: MediaStream | null,
  setStream: (stream: MediaStream | null) => void,
  deviceId: string,
  type: 'audio' | 'video'
) {
  if (stream) stream.getTracks().forEach((track) => track.stop());
  try {
    const constraints: MediaStreamConstraints = {
      [type]: { deviceId: { exact: deviceId } },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setStream(stream);
    return true;
  } catch (error) {
    console.info(`[ERROR] on create ${type} stream `, error);
    toast.error(`Error on get media stream`, toastConfig);
    return false;
  }
}
