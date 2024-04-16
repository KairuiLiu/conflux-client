import { MeetingContextState } from '@/types/meeting';
import useGlobalStore from '../global-context';

function initState(): MeetingContextState {
  const globalState = useGlobalStore.getState();
  return {
    meetingState: {
      id: '',
      title: `${globalState.user.name}'s Meeting`,
      meetingStartTime: 0,
      organizer: {
        muid: '',
        name: '',
      },
      participants: [],
    },
    meetingDeviceState: {
      enableCamera: globalState.user.autoEnableCamera,
      cameraLabel:
        globalState.user.defaultCamera ||
        globalState.mediaDiveces.camera?.[0]?.label ||
        '',
      enableMic: globalState.user.autoEnableMic,
      micLabel:
        globalState.user.defaultMic ||
        globalState.mediaDiveces.microphone?.[0]?.label ||
        '',
      enableSpeaker: globalState.user.autoEnableSpeaker,
      speakerLabel:
        globalState.user.defaultSpeaker ||
        globalState.mediaDiveces.speaker?.[0]?.label ||
        '',
    },
    meeetingUserName: globalState.user.name,
  };
}

export default initState;
