import { UserInfo } from './user';

interface MeetingState {
  id: string;
  title: string;
  meetingStartTime: number;
  organizer: UserInfo;
  participants: UserInfo[];
}

interface MeetingDeviceState {
  enableCamera: boolean;
  cameraLabel: string;
  enableMic: boolean;
  micLabel: string;
  enableSpeaker: boolean;
  speakerLabel: string;
}

interface MeetingContext {
  meetingState: MeetingState;
  meetingDeviceState: MeetingDeviceState;
  meeetingUserName: string;
}
