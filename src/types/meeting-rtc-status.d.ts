type MeetingRTCStatusKey =
  | 'Bandwidth'
  | 'PackageLost'
  | 'Delay'
  | 'Bitrate'
  | 'Microphone'
  | 'Speaker'
  | 'Resolution'
  | 'Framerate';

interface MeetingRTCStatusItem {
  upload?: string;
  download?: string;
  value?: string;
}

interface MeetingRTCStatus {
  title: 'Network' | 'Audio' | 'Video' | 'Screen Sharing';
  [key: string]: MeetingRTCStatusItem | string;
}
