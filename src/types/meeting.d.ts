import { UserInfo } from './user';

interface MeetingState {
  id: string;
  title?: string;
  meetingStartTime?: number;
  organizer: {
    muid: string;
    name: string;
  };
  participants: Participant[];
}

interface SetMeetingState {
  setId: (id: string) => void;
  setTitle: (title: string) => void;
  setMeetingStartTime: (meetingStartTime: number) => void;
  setOrganizer: (organizer: { muid: string; name: string }) => void;
  setParticipants: (participants: UserInfo[]) => void;
}

interface MeetingDeviceState {
  enableCamera: boolean;
  cameraLabel: string;
  enableMic: boolean;
  micLabel: string;
  enableSpeaker: boolean;
  speakerLabel: string;
  enableShare: boolean;
}

interface SetMeetingDeviceState {
  setEnableCamera: (enableCamera: boolean) => void;
  setCameraLabel: (cameraLabel: string) => void;
  setEnableMic: (enableMic: boolean) => void;
  setMicLabel: (micLabel: string) => void;
  setEnableSpeaker: (enableSpeaker: boolean) => void;
  setSpeakerLabel: (speakerLabel: string) => void;
  setEnableShare: (enableShare: boolean) => void;
}

interface MeetingContextState {
  meetingState: MeetingState;
  meetingDeviceState: MeetingDeviceState;
  selfMuid: string;
  unactiveUserName: string;
  exiting: boolean;
}

interface SetMeetingContext {
  setMeetingState: SetMeetingState;
  setMeetingDeviceState: SetMeetingDeviceState;
  setSelfMuid: (selfMuid: string) => void;
  setUnactiveUserName: (unAtiveUserName: string) => void;
  setExiting: (exiting: boolean) => void;
}

type MeetingContextType = MeetingContextState &
  SetMeetingContext & {
    resetMeetingContext: () => void;
  };
