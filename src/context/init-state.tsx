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
    },
    mediaDiveces: {
      camera: [],
      microphone: [],
      speaker: [],
    },
  };
}
