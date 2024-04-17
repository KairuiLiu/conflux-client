import { v4 as uuidv4 } from 'uuid';

export function initState(
  setState: (v: (state: StateType) => StateType) => void
): StateType {
  const localStorageState = localStorage.getItem('state');
  const localStorageStateParsed =
    localStorageState && JSON.parse(localStorageState)?.state;
  const uuid = uuidv4();
  const res = {
    user: localStorageStateParsed?.user || {
      uuid: uuid,
      avatar: null,
      name: `User_${uuid.slice(0, 8)}`,
      autoEnableCamera: true,
      defaultCamera: null,
      autoEnableMic: true,
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
    siteConfig: {
      token: '',
      COTURN_PASSWORD: '',
      COTURN_PATH: '',
      COTURN_USERNAME: '',
      PEER_SERVER_PATH: '',
    },
  } as StateType;
  fetchConfig(res.user.uuid, setState);
  return res;
}

function fetchConfig(
  uuid: string,
  setState: (v: (state: StateType) => StateType) => void
) {
  fetch(`/api/config?uuid=${uuid}`)
    // on cannet failed

    .then((d) => d.json())
    .then((res) => {
      if (res.code) console.info('fetch token error', res.msg);
      else
        setState((state) => ({
          ...state,
          siteConfig: res.data,
        }));
    })
    .catch((e) => console.info('fetch error', e));
}
