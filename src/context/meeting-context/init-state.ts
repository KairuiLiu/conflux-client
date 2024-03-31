import { MeetingContextState } from '@/types/meeting';
import useGlobalStore from '../global-context';

function initState(): MeetingContextState {
  const globalState = useGlobalStore.getState();
  return {
    meetingState: {
      id: '',
      title: `${globalState.user.name}'s Meeting`,
      meetingStartTime: 0,
      organizer: null,
      participants: [],
    },
    meetingDeviceState: {
      enableCamera:
        globalState.user.autoEnableCamera && !!globalState.user.defaultCamera,
      cameraLabel: globalState.user.defaultCamera || '',
      enableMic:
        globalState.user.autoEnableMic && !!globalState.user.defaultMic,
      micLabel: globalState.user.defaultMic || '',
      enableSpeaker:
        globalState.user.autoEnableSpeaker && !!globalState.user.defaultSpeaker,
      speakerLabel: globalState.user.defaultSpeaker || '',
    },
    meeetingUserName: globalState.user.name,
  };
}

export default initState;
