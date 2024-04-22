import toastConfig from '@/utils/toast-config';
import { toast } from 'react-toastify';
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
    rtcStatus: getNewRtcStatus(),
    siteConfig: {
      token: '',
      COTURN_PASSWORD: '',
      COTURN_PREFIX: '',
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
      if (res.code) throw res.msg;
      else
        setState((state) => ({
          ...state,
          siteConfig: res.data,
        }));
    })
    .catch((e) => {
      console.info('[ERROR] Fetch config failed ', e);
      toast.error('Network error, try again later.', toastConfig);
    });
}

export function getNewRtcStatus(): MeetingRTCStatus[] {
  return [
    {
      title: 'Network',
      Bandwidth: {
        upload: '- kbps',
        download: '- kbps',
      },
      PackageLost: {
        value: '- %',
      },
      Delay: {
        value: '- ms',
      },
    },
    {
      title: 'Audio',
      Bitrate: {
        upload: '- kbps',
        download: '- kbps',
      },
    },
    {
      title: 'Video',
      Resolution: {
        upload: '-',
        download: '-',
      },
      Framerate: {
        upload: '- fps',
        download: '- fps',
      },
      Bitrate: {
        upload: '- kbps',
        download: '- kbps',
      },
    },
    {
      title: 'Screen Sharing',
      Resolution: {
        upload: '-',
        download: '-',
      },
      Framerate: {
        upload: '- fps',
        download: '- fps',
      },
      Bitrate: {
        upload: '- kbps',
        download: '- kbps',
      },
    },
  ];
}
