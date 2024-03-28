import { UserInfo } from './user';

interface MeetingInfo {
  id: string;
  title: string;
  meetingStartTime: number;
  organizer: UserInfo;
  participants: UserInfo[];
}

interface UserMeetingDeviceInfo {
  enableCamera: boolean;
  enableMic: boolean;
  enableScreenShare: boolean;
  enableSpeaker: boolean;
  cameraLabel: string;
  micLabel: string;
  speakerLabel: string;
}
