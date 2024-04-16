import { UserInfo } from './user';

interface MeetingState {
  id: string;
  title?: string;
  meetingStartTime?: number;
  organizer: {
    muid: string;
    name: string;
  };
  participants: UserInfo[];
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
}

interface SetMeetingDeviceState {
  setEnableCamera: (enableCamera: boolean) => void;
  setCameraLabel: (cameraLabel: string) => void;
  setEnableMic: (enableMic: boolean) => void;
  setMicLabel: (micLabel: string) => void;
  setEnableSpeaker: (enableSpeaker: boolean) => void;
  setSpeakerLabel: (speakerLabel: string) => void;
}

interface MeetingContextState {
  meetingState: MeetingState;
  meetingDeviceState: MeetingDeviceState;
  meeetingUserName: string;
}

interface SetMeetingContext {
  setMeetingState: SetMeetingState;
  setMeetingDeviceState: SetMeetingDeviceState;
  setMeetingUserName: (meeetingUserName: string) => void;
}

type MeetingContextType = MeetingContextState &
  SetMeetingContext & {
    resetMeetingContext: () => void;
  };
