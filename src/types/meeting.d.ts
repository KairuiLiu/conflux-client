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

interface SelfState {
  muid: string;
  camStream: MediaStream | null;
  screenStream: MediaStream | null;
  name: string;
  exiting: boolean;
  role: 'HOST' | 'PARTICIPANT';
  participantSelf?: Participant;
}

interface SetSelfState {
  setMuid: (muid: string) => void;
  setCamStream: (camStream: MediaStream) => void;
  setScreenStream: (screenStream: MediaStream) => void;
  setName: (name: string) => void;
  setExiting: (exiting: boolean) => void;
  setParticipantSelf: (participantSelf: Participant) => void;
  setRole: (role: 'HOST' | 'PARTICIPANT') => void;
}

interface PeerStream {
  active: boolean;
  stream: MediaStream;
}

interface MeetingContextState {
  meetingState: MeetingState;
  meetingDeviceState: MeetingDeviceState;
  selfState: SelfState;
  meetingStream: Map<string, PeerStream>;
}

interface SetMeetingContext {
  setMeetingState: SetMeetingState;
  setMeetingDeviceState: SetMeetingDeviceState;
  setMeetingStream: (meetingStream: Map<string, PeerStream>) => void;
  setSelfState: SetSelfState;
}

type MeetingContextType = MeetingContextState &
  SetMeetingContext & {
    resetMeetingContext: () => void;
  };
