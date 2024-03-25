import { UserInfo } from './user';

interface MeetingInfo {
  id: string;
  title: string;
  meetingStartTime: number;
  organizer: UserInfo;
  participants: UserInfo[];
}
