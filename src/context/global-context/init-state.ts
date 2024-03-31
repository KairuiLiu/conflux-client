import { v4 as uuidv4 } from 'uuid';

export function initState(): StateType {
  const localStorageState = localStorage.getItem('state');
  const localStorageStateParsed =
    localStorageState && JSON.parse(localStorageState);
  const uuid = uuidv4();
  return {
    user: localStorageStateParsed?.user || {
      uuid: uuid,
      avatar: null,
      name: `User_${uuid.slice(0, 8)}`,
      autoEnableCamera: false,
      defaultCamera: null,
      autoEnableMic: false,
      defaultMic: null,
      autoEnableSpeaker: true,
      defaultSpeaker: null,
      mirrorCamera: true,
      expandCamera: true,
    },
    mediaDiveces: {
      camera: [],
      microphone: [],
      speaker: [],
    },
    rtcStatus: [
      {
        title: 'Network',
        Bandwidth: {
          upload: '0 kbps',
          download: '0 kbps',
        },
        PackageLost: {
          upload: '0 %',
          download: '0 %',
        },
        Delay: {
          value: '0 ms',
        },
      },
      {
        title: 'Audio',
        Bitrate: {
          upload: '0 kbps',
          download: '0 kbps',
        },
        Microphone: {
          value: '0 dB',
        },
        Speaker: {
          value: '0 dB',
        },
      },
      {
        title: 'Video',
        Resolution: {
          upload: '0 x 0',
          download: '0 x 0',
        },
        Framerate: {
          upload: '0 fps',
          download: '0 fps',
        },
        Bitrate: {
          upload: '0 kbps',
          download: '0 kbps',
        },
      },
      {
        title: 'Screen Sharing',
        Resolution: {
          upload: '0 x 0',
          download: '0 x 0',
        },
        Framerate: {
          upload: '0 fps',
          download: '0 fps',
        },
        Bitrate: {
          upload: '0 kbps',
          download: '0 kbps',
        },
      },
    ],
  };
}
